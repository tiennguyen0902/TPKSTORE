/**
 * REGRESSION FIXES TEST SUITE
 * Verifies bug fixes for business logic:
 * - REG-01: Order status transition control (DELIVERED -> PENDING is blocked 400)
 * - REG-02: Valid order status transition (PENDING -> CONFIRMED returns 200)
 * - REG-03: Concurrent order stock over-selling prevention via atomic DB update
 * - REG-04: MANAGER role authorized to use POS counter sales
 * - REG-05: Password registration rule validation (min 8 chars, letter + number)
 * - REG-06: Cancelled order cannot be confirmed via /payment/vnpay-confirm (returns 400, remains CANCELLED)
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

const results = [];

function recordTest(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${id}: ${name} ${details ? '(' + details + ')' : ''}`);
}

async function apiRequest(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // response without json
  }

  return { status: response.status, data };
}

async function loginUser(email, password = 'Password123@') {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (res.status === 200 && res.data?.tokens?.accessToken) {
    return res.data.tokens.accessToken;
  }
  throw new Error(`Failed to login as ${email}: status ${res.status} ${JSON.stringify(res.data)}`);
}

async function runRegressionSuite() {
  console.log('================================================================');
  console.log('       TPKSTORE REGRESSION FIXES TEST SUITE                     ');
  console.log('================================================================\n');

  let adminToken, managerToken, staffToken, customerToken;

  try {
    console.log('Authenticating roles (ADMIN, MANAGER, STAFF, CUSTOMER)...');
    adminToken = await loginUser('admin@example.com');
    managerToken = await loginUser('manager@example.com');
    staffToken = await loginUser('staff@example.com');
    customerToken = await loginUser('customer@example.com');
    console.log('Roles authenticated successfully.\n');
  } catch (err) {
    console.error('Authentication setup failed:', err.message);
    process.exit(1);
  }

  // Find a product to test with
  const prodRes = await apiRequest('/products?limit=10', { method: 'GET' });
  const products = prodRes.data?.products || prodRes.data || [];
  const testProduct = products[0];

  if (!testProduct) {
    console.error('No sample product found in database.');
    process.exit(1);
  }

  const originalStock = typeof testProduct.stock === 'number' ? testProduct.stock : 20;
  const createdOrderIds = [];

  try {
    // ---------------------------------------------------------
    // REG-01: Order status DELIVERED -> PENDING must return 400
    // ---------------------------------------------------------
    {
      // Create a delivered POS order
      const posOrderRes = await apiRequest('/orders/pos', {
        method: 'POST',
        body: JSON.stringify({
          customerName: 'Regression Delivered Customer',
          phone: '0987111222',
          items: [{ productId: testProduct.id, quantity: 1, price: testProduct.price }],
          paymentMethod: 'COD',
          status: 'DELIVERED',
          paymentStatus: 'COMPLETED'
        })
      }, adminToken);

      const orderId = posOrderRes.data?.order?.id;
      if (orderId) createdOrderIds.push(orderId);

      // Attempt invalid transition: DELIVERED -> PENDING
      const updateRes = await apiRequest(`/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'PENDING' })
      }, adminToken);

      const passed = updateRes.status === 400;
      recordTest('REG-01', 'DELIVERED order cannot be transitioned to PENDING (400 Bad Request)', passed, `Status: ${updateRes.status}, Error: "${updateRes.data?.error || ''}"`);
    }

    // ---------------------------------------------------------
    // REG-02: Order status PENDING -> CONFIRMED must return 200
    // ---------------------------------------------------------
    {
      const newOrderRes = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: 'Regression Pending Customer',
          phone: '0987222333',
          shippingAddress: '123 Đường Test, Quận 1, TP.HCM',
          paymentMethod: 'COD',
          items: [{ productId: testProduct.id, quantity: 1 }]
        })
      }, customerToken);

      const pendingOrderId = newOrderRes.data?.order?.id;
      if (pendingOrderId) createdOrderIds.push(pendingOrderId);

      const confirmRes = await apiRequest(`/orders/${encodeURIComponent(pendingOrderId)}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'CONFIRMED' })
      }, adminToken);

      const passed = confirmRes.status === 200 && confirmRes.data?.order?.status === 'CONFIRMED';
      recordTest('REG-02', 'PENDING order successfully transitions to CONFIRMED (200 OK)', passed, `Status: ${confirmRes.status}, New State: ${confirmRes.data?.order?.status}`);
    }

    // ---------------------------------------------------------
    // REG-03: Concurrent order stock over-selling prevention
    // ---------------------------------------------------------
    {
      // 1. Set stock to exactly 1
      await apiRequest('/inventory/adjustment', {
        method: 'POST',
        body: JSON.stringify({
          productId: testProduct.id,
          actualStock: 1,
          reason: 'Regression Test REG-03 Setup stock to 1'
        })
      }, adminToken);

      // 2. Concurrently place 2 orders, each ordering quantity = 1
      const [orderRes1, orderRes2] = await Promise.all([
        apiRequest('/orders', {
          method: 'POST',
          body: JSON.stringify({
            customerName: 'Concurrent User 1',
            phone: '0987333441',
            shippingAddress: 'HCM 1',
            paymentMethod: 'COD',
            items: [{ productId: testProduct.id, quantity: 1 }]
          })
        }, customerToken),
        apiRequest('/orders', {
          method: 'POST',
          body: JSON.stringify({
            customerName: 'Concurrent User 2',
            phone: '0987333442',
            shippingAddress: 'HCM 2',
            paymentMethod: 'COD',
            items: [{ productId: testProduct.id, quantity: 1 }]
          })
        }, customerToken)
      ]);

      if (orderRes1.data?.order?.id) createdOrderIds.push(orderRes1.data.order.id);
      if (orderRes2.data?.order?.id) createdOrderIds.push(orderRes2.data.order.id);

      const successCount = (orderRes1.status === 201 ? 1 : 0) + (orderRes2.status === 201 ? 1 : 0);
      const failCount = (orderRes1.status === 400 ? 1 : 0) + (orderRes2.status === 400 ? 1 : 0);

      // 3. Verify final stock is 0 and never negative
      const checkProd = await apiRequest(`/products/${testProduct.id}`, { method: 'GET' });
      const finalStock = checkProd.data?.stock;

      const passed = successCount === 1 && failCount === 1 && finalStock === 0;
      recordTest('REG-03', 'Concurrent orders prevent over-selling (1 success, 1 fail, final stock = 0)', passed, `Success: ${successCount}, Fail: ${failCount}, Final Stock: ${finalStock}`);
    }

    // ---------------------------------------------------------
    // REG-04: MANAGER role calling POST /orders/pos -> not 403
    // ---------------------------------------------------------
    {
      // First ensure enough stock for 1 unit
      await apiRequest('/inventory/adjustment', {
        method: 'POST',
        body: JSON.stringify({
          productId: testProduct.id,
          actualStock: 5,
          reason: 'Regression Test REG-04 Stock adjustment'
        })
      }, adminToken);

      const posRes = await apiRequest('/orders/pos', {
        method: 'POST',
        body: JSON.stringify({
          customerName: 'Manager Counter Customer',
          phone: '0987555666',
          items: [{ productId: testProduct.id, quantity: 1, price: testProduct.price }],
          paymentMethod: 'COD',
          status: 'DELIVERED',
          paymentStatus: 'COMPLETED'
        })
      }, managerToken);

      if (posRes.data?.order?.id) createdOrderIds.push(posRes.data.order.id);

      const passed = posRes.status === 201 && posRes.status !== 403;
      recordTest('REG-04', 'MANAGER role can create POS counter order without 403 Forbidden', passed, `Status: ${posRes.status}, OrderId: ${posRes.data?.order?.id || 'none'}`);
    }

    // ---------------------------------------------------------
    // REG-05: Register with 6-char password "abc123" -> returns 400
    // ---------------------------------------------------------
    {
      const regRes = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: `regression_${Date.now()}@example.com`,
          password: 'abc123',
          fullName: 'Test Short Password'
        })
      });

      const passed = regRes.status === 400;
      recordTest('REG-05', 'Register with 6-char password "abc123" is rejected with 400 Bad Request', passed, `Status: ${regRes.status}, Error: "${regRes.data?.error || ''}"`);
    }

    // ---------------------------------------------------------
    // REG-06: Cancelled order cannot be confirmed via /payment/vnpay-confirm (400 Bad Request, remains CANCELLED)
    // ---------------------------------------------------------
    {
      // 1. Create PENDING order
      const newOrderRes = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: 'Regression Cancelled Customer',
          phone: '0987999888',
          shippingAddress: '456 Đường Test, Quận 1, TP.HCM',
          paymentMethod: 'VNPAY',
          items: [{ productId: testProduct.id, quantity: 1 }]
        })
      }, customerToken);

      const cancelOrderId = newOrderRes.data?.order?.id;
      if (cancelOrderId) createdOrderIds.push(cancelOrderId);

      // 2. Cancel order
      const cancelRes = await apiRequest(`/orders/${encodeURIComponent(cancelOrderId)}/cancel`, {
        method: 'POST'
      }, customerToken);

      // 3. Attempt to confirm payment on cancelled order via /payment/vnpay-confirm
      const confirmRes = await apiRequest('/payment/vnpay-confirm', {
        method: 'POST',
        body: JSON.stringify({
          orderId: cancelOrderId,
          responseCode: '00'
        })
      }, customerToken);

      // 4. Verify order remains CANCELLED
      const orderCheckRes = await apiRequest(`/orders/${encodeURIComponent(cancelOrderId)}`, {
        method: 'GET'
      }, customerToken);

      const finalStatus = orderCheckRes.data?.status || orderCheckRes.data?.order?.status;
      const passed = confirmRes.status === 400 && finalStatus === 'CANCELLED';
      recordTest('REG-06', 'Cancelled order cannot be confirmed via /payment/vnpay-confirm (400 Bad Request, remains CANCELLED)', passed, `Confirm Status: ${confirmRes.status}, Order Status: ${finalStatus}`);
    }

  } finally {
    // ---------------------------------------------------------
    // CLEANUP TEST DATA
    // ---------------------------------------------------------
    console.log('\nCleaning up regression test artifacts...');

    // Restore test product stock
    try {
      await apiRequest('/inventory/adjustment', {
        method: 'POST',
        body: JSON.stringify({
          productId: testProduct.id,
          actualStock: originalStock,
          reason: 'Restore original stock after Regression Test Suite'
        })
      }, adminToken);
      console.log(`Restored product ${testProduct.id} stock to original: ${originalStock}`);
    } catch (e) {
      console.warn('Could not restore stock:', e.message);
    }
  }

  // ---------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------
  console.log('\n================================================================');
  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = total - passedCount;
  console.log(`TEST RESULTS: ${passedCount}/${total} PASSED (${failedCount} FAILED)`);
  console.log('================================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runRegressionSuite().catch(err => {
  console.error('Fatal regression suite error:', err);
  process.exit(1);
});
