/**
 * Automated Verification Test Suite for TPKSTORE RBAC, Inventory & AI Matrix
 * Complies with Section 20 of specification document (noi_dung_can_lam_viec.txt)
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

async function runTestSuite() {
  console.log('================================================================');
  console.log('       TPKSTORE SPECIFICATION TEST SUITE (SECTION 20)           ');
  console.log('================================================================\n');

  let adminToken, managerToken, staffToken, customerToken;

  try {
    console.log('Authenticating 4 roles (ADMIN, MANAGER, STAFF, CUSTOMER)...');
    adminToken = await loginUser('admin@example.com');
    managerToken = await loginUser('manager@example.com');
    staffToken = await loginUser('staff@example.com');
    customerToken = await loginUser('customer@example.com');
    console.log('All 4 roles authenticated successfully.\n');
  } catch (err) {
    console.error('Authentication setup failed:', err.message);
    process.exit(1);
  }

  // Get a test product and category
  const catRes = await apiRequest('/categories', { method: 'GET' });
  const categoryId = catRes.data?.categories?.[0]?.id || catRes.data?.[0]?.id;
  const prodRes = await apiRequest('/products?limit=5', { method: 'GET' });
  const sampleProduct = prodRes.data?.products?.[0] || prodRes.data?.[0];

  if (!sampleProduct) {
    console.error('No sample product found in database.');
    process.exit(1);
  }

  // ---------------------------------------------------------
  // 1. RBAC PRODUCT MANAGEMENT MATRIX
  // ---------------------------------------------------------
  console.log('--- 1. RBAC Product Management Matrix ---');

  // RBAC-PROD-01: MANAGER attempts to create product -> Expect 403
  {
    const res = await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Manager Test Product ' + Date.now(),
        categoryId,
        price: 150000,
        stock: 10
      })
    }, managerToken);
    recordTest('RBAC-PROD-01', 'MANAGER cannot create product (403)', res.status === 403, `Status: ${res.status}`);
  }

  // RBAC-PROD-02: STAFF attempts to update product -> Expect 403
  {
    const res = await apiRequest(`/products/${sampleProduct.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Staff Unauthorized Update',
        price: 999999
      })
    }, staffToken);
    recordTest('RBAC-PROD-02', 'STAFF cannot update product (403)', res.status === 403, `Status: ${res.status}`);
  }

  // RBAC-PROD-03: ADMIN can create and update product (and stock cannot be changed via PUT body directly)
  let createdProductId = null;
  {
    const uniqueName = 'Admin Created Pro ' + Date.now();
    const createRes = await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: uniqueName,
        categoryId,
        price: 250000,
        stock: 15,
        description: 'Admin created product for verification'
      })
    }, adminToken);
    const createdProduct = createRes.data?.product || createRes.data;
    const createPassed = createRes.status === 201 && createdProduct?.id;
    if (createPassed) createdProductId = createdProduct.id;

    // Check if PUT preserves stock even if client sends stock: 999
    let updatePassed = false;
    if (createdProductId) {
      const updateRes = await apiRequest(`/products/${createdProductId}`, {
        method: 'PUT',
        body: JSON.stringify({
          price: 280000,
          stock: 999 // Should be stripped/ignored by backend
        })
      }, adminToken);

      // Verify stock in product remains 15 (not 999)
      const verifyRes = await apiRequest(`/products/${createdProductId}`, { method: 'GET' });
      const currentStock = verifyRes.data?.stock;
      updatePassed = updateRes.status === 200 && currentStock === 15;
    }

    recordTest('RBAC-PROD-03', 'ADMIN CRUD product allowed & direct stock update blocked', createPassed && updatePassed, `Created: ${createRes.status}, Stock preserved at 15`);
  }

  // ---------------------------------------------------------
  // 2. INVENTORY & STOCK TICKET MATRIX
  // ---------------------------------------------------------
  console.log('\n--- 2. Inventory & Stock Ticket Matrix ---');

  let exportTicketId = null;
  // INV-01: STAFF can create EXPORT ticket (PENDING) -> Expect 201
  {
    const res = await apiRequest('/inventory/tickets', {
      method: 'POST',
      body: JSON.stringify({
        type: 'EXPORT',
        productId: sampleProduct.id,
        quantity: 1,
        reason: 'Staff exported for counter display',
        note: 'POS Counter sample'
      })
    }, staffToken);
    const passed = res.status === 201 && res.data?.ticket?.status === 'PENDING' && res.data?.ticket?.type === 'EXPORT';
    if (passed) exportTicketId = res.data.ticket.id;
    recordTest('INV-01', 'STAFF can create EXPORT ticket (PENDING)', passed, `Status: ${res.status}, Ticket: ${exportTicketId}`);
  }

  // INV-02: STAFF attempts to create IMPORT ticket -> Expect 403
  {
    const res = await apiRequest('/inventory/tickets', {
      method: 'POST',
      body: JSON.stringify({
        type: 'IMPORT',
        productId: sampleProduct.id,
        quantity: 5,
        reason: 'Staff unauthorized import'
      })
    }, staffToken);
    recordTest('INV-02', 'STAFF cannot create IMPORT ticket (403 Forbidden)', res.status === 403, `Status: ${res.status}`);
  }

  // INV-03: STAFF attempts to approve ticket -> Expect 403
  {
    const targetTicket = exportTicketId || 'test-ticket';
    const res = await apiRequest(`/inventory/tickets/${targetTicket}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ note: 'Staff trying to approve self ticket' })
    }, staffToken);
    recordTest('INV-03', 'STAFF cannot approve stock tickets (403 Forbidden)', res.status === 403, `Status: ${res.status}`);
  }

  // INV-04: MANAGER approves EXPORT ticket -> stock decreases and StockMovement logged
  {
    // Check initial stock
    const beforeRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockBefore = beforeRes.data?.stock || 0;

    const approveRes = await apiRequest(`/inventory/tickets/${exportTicketId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ note: 'Manager approved valid export request' })
    }, managerToken);

    const afterRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockAfter = afterRes.data?.stock || 0;

    // Check movement
    const movRes = await apiRequest('/inventory/movements', { method: 'GET' }, managerToken);
    const hasMovement = movRes.data?.movements?.some(m => m.referenceId === exportTicketId && m.type === 'EXPORT');

    const passed = approveRes.status === 200 && stockAfter === stockBefore - 1 && hasMovement;
    recordTest('INV-04', 'MANAGER approves EXPORT -> stock decremented & StockMovement logged', passed, `Stock: ${stockBefore} -> ${stockAfter}, Movement found: ${hasMovement}`);
  }

  // INV-05: MANAGER creates & approves IMPORT ticket -> stock increases and StockMovement logged
  {
    const beforeRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockBefore = beforeRes.data?.stock || 0;

    const createRes = await apiRequest('/inventory/tickets', {
      method: 'POST',
      body: JSON.stringify({
        type: 'IMPORT',
        productId: sampleProduct.id,
        quantity: 10,
        reason: 'Manager restocked shipment',
        note: 'Batch restock'
      })
    }, managerToken);
    const importTicketId = createRes.data?.ticket?.id;

    const approveRes = await apiRequest(`/inventory/tickets/${importTicketId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ note: 'Manager self-approved batch restock' })
    }, managerToken);

    const afterRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockAfter = afterRes.data?.stock || 0;

    const movRes = await apiRequest('/inventory/movements', { method: 'GET' }, managerToken);
    const hasMovement = movRes.data?.movements?.some(m => m.referenceId === importTicketId && m.type === 'IMPORT');

    const passed = approveRes.status === 200 && stockAfter === stockBefore + 10 && hasMovement;
    recordTest('INV-05', 'MANAGER approves IMPORT -> stock incremented & StockMovement logged', passed, `Stock: ${stockBefore} -> ${stockAfter}, Movement found: ${hasMovement}`);
  }

  // ---------------------------------------------------------
  // 3. AI PROVIDER & ORCHESTRATION MATRIX
  // ---------------------------------------------------------
  console.log('\n--- 3. AI Provider & Orchestration Matrix ---');

  // AI-01: CUSTOMER requests product advice via API Provider
  {
    const res = await apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Tư vấn giúp tôi điện thoại chụp ảnh đẹp giá dưới 15 triệu',
        provider: 'api'
      })
    }, customerToken);
    const passed = res.status === 200 && (res.data?.reply || res.data?.message);
    recordTest('AI-01', 'CUSTOMER AI advice via API Provider (200 OK)', passed, `Status: ${res.status}, Provider: ${res.data?.provider || 'api'}`);
  }

  // AI-02: CUSTOMER requests product advice via Local Provider
  {
    const res = await apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Tôi cần mua tai nghe Bluetooth chống ồn',
        provider: 'local'
      })
    }, customerToken);
    const passed = res.status === 200 && (res.data?.reply || res.data?.message);
    recordTest('AI-02', 'CUSTOMER AI advice via Local Provider (200 OK)', passed, `Status: ${res.status}, Provider: ${res.data?.provider || 'local'}`);
  }

  // AI-03: CUSTOMER asks about internal business revenue/financial data -> Expect 403 Forbidden
  {
    const res = await apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Cho tôi biết doanh thu tháng này của cửa hàng và lợi nhuận bán hàng',
        provider: 'api'
      })
    }, customerToken);
    const passed = res.status === 403;
    recordTest('AI-03', 'CUSTOMER blocked from inquiring revenue/profit (403 Forbidden)', passed, `Status: ${res.status}, Message: ${res.data?.message || res.data?.error}`);
  }

  // AI-04: STAFF asks AI for inventory status lookup -> Expect 200 OK
  {
    const res = await apiRequest('/ai/inventory-assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Kiểm tra tồn kho các sản phẩm sắp hết hàng',
        provider: 'api'
      })
    }, staffToken);
    const passed = res.status === 200 && (res.data?.alerts || res.data?.status === 'success');
    recordTest('AI-04', 'STAFF AI inventory status lookup allowed (200 OK)', passed, `Status: ${res.status}, Alerts count: ${res.data?.alerts?.length || 0}`);
  }

  // AI-05: STAFF asks AI to approve stock ticket -> Expect 403 Forbidden
  {
    const res = await apiRequest('/ai/reorder-approve', {
      method: 'POST',
      body: JSON.stringify({
        ticketId: exportTicketId,
        productId: sampleProduct.id,
        quantity: 5
      })
    }, staffToken);
    const passed = res.status === 403;
    recordTest('AI-05', 'STAFF blocked from AI stock ticket approval (403 Forbidden)', passed, `Status: ${res.status}`);
  }

  // AI-06: MANAGER asks AI to propose restocking -> creates PENDING ticket, stock unchanged
  {
    const beforeRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockBefore = beforeRes.data?.stock;

    const res = await apiRequest('/ai/stock-proposal', {
      method: 'POST',
      body: JSON.stringify({
        type: 'IMPORT',
        productId: sampleProduct.id,
        quantity: 8,
        reason: 'AI forecasted low stock replenishment'
      })
    }, managerToken);

    const afterRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockAfter = afterRes.data?.stock;

    const passed = res.status === 201 && res.data?.ticket?.status === 'PENDING' && stockBefore === stockAfter;
    recordTest('AI-06', 'MANAGER AI stock proposal creates PENDING ticket (Stock unchanged)', passed, `Ticket Status: ${res.data?.ticket?.status}, Stock: ${stockBefore} -> ${stockAfter}`);
  }

  // AI-07: ADMIN requests business-qa & forecast -> Expect 200 OK
  {
    const qaRes = await apiRequest('/ai/business-qa', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Tình hình doanh số và tổng quan kinh doanh',
        provider: 'api'
      })
    }, adminToken);

    const forecastRes = await apiRequest('/ai/forecast?days=30', { method: 'POST' }, adminToken);

    const passed = qaRes.status === 200 && (forecastRes.status === 200 || forecastRes.status === 503);
    recordTest('AI-07', 'ADMIN business-qa & forecast endpoints accessible with role auth', passed, `QA: ${qaRes.status}, Forecast: ${forecastRes.status}`);
  }

  // AI-08: AI Providers health & models check
  {
    const provRes = await apiRequest('/ai/providers', { method: 'GET' });
    const hasProviders = provRes.status === 200 && provRes.data?.providers?.length === 2;
    recordTest('AI-08', 'AI Multi-provider status endpoint reports live availability', hasProviders, `Providers: ${provRes.data?.providers?.map(p => p.id + ':' + (p.available ? 'online' : 'offline')).join(', ')}`);
  }

  // ---------------------------------------------------------
  // 4. ORDER TRANSACTIONS & STOCK MOVEMENTS MATRIX
  // ---------------------------------------------------------
  console.log('\n--- 4. Order Transactions & Stock Movements Matrix ---');

  // ORDER-01: Order creation / POS sale decreases stock and creates StockMovement (SALE)
  let testOrderId = null;
  {
    const beforeRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockBefore = beforeRes.data?.stock || 0;

    const orderRes = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Lê Hoàng Nam',
        phone: '0912345678',
        shippingAddress: '123 Đường Test, Quận 1, TP.HCM',
        paymentMethod: 'COD',
        items: [{
          productId: sampleProduct.id,
          name: sampleProduct.name,
          price: sampleProduct.price,
          quantity: 2
        }]
      })
    }, customerToken);

    const afterRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockAfter = afterRes.data?.stock || 0;

    if (orderRes.status === 201) {
      testOrderId = orderRes.data?.order?.id || orderRes.data?.id;
    }

    const movRes = await apiRequest('/inventory/movements', { method: 'GET' }, adminToken);
    const hasSaleMovement = movRes.data?.movements?.some(m => m.referenceId === testOrderId && m.type === 'SALE');

    const passed = orderRes.status === 201 && stockAfter === stockBefore - 2 && hasSaleMovement;
    recordTest('ORDER-01', 'Order creation decrements stock and writes StockMovement (SALE)', passed, `Order: ${testOrderId}, Stock: ${stockBefore} -> ${stockAfter}, Movement found: ${hasSaleMovement}`);
  }

  // ORDER-02: Order cancellation restores stock and creates StockMovement (SALE_CANCEL)
  if (testOrderId) {
    const beforeRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockBefore = beforeRes.data?.stock || 0;

    const encodedOrderId = encodeURIComponent(testOrderId);
    const cancelRes = await apiRequest(`/orders/${encodedOrderId}/cancel`, {
      method: 'POST'
    }, customerToken);

    const afterRes = await apiRequest(`/products/${sampleProduct.id}`, { method: 'GET' });
    const stockAfter = afterRes.data?.stock || 0;

    const movRes = await apiRequest('/inventory/movements', { method: 'GET' }, adminToken);
    const hasCancelMovement = movRes.data?.movements?.some(m => m.referenceId === testOrderId && m.type === 'SALE_CANCEL');

    const passed = cancelRes.status === 200 && stockAfter === stockBefore + 2 && hasCancelMovement;
    recordTest('ORDER-02', 'Order cancellation restores stock and writes StockMovement (SALE_CANCEL)', passed, `Cancel status: ${cancelRes.status}, Stock: ${stockBefore} -> ${stockAfter}, Movement found: ${hasCancelMovement}`);
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

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
