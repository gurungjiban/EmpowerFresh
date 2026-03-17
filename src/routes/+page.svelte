<script lang="ts">
  import { onMount } from 'svelte';

  let selected = $state(''); 
  let message = $state('');

  // Customers
  let customers = $state<any[]>([]);
  let custName = $state('');
  let custEmail = $state('');
  let custPhone = $state('');

  // Stores
  let stores = $state<any[]>([]);
  let storeName = $state('');
  let storeLocation = $state('');
  let storeCustomerId = $state<number|null>(null);

  // Products
  let products = $state<any[]>([]);
  let prodName = $state('');
  let prodPrice = $state<number|null>(null);
  let prodStoreId = $state<number|null>(null);

  // --- Load functions ---
  async function loadCustomers() {
    const res = await fetch('http://localhost:3000/customers');
    customers = await res.json();
  }

  async function loadStores() {
    const res = await fetch('http://localhost:3000/stores');
    stores = await res.json();
  }

  async function loadProducts() {
    const res = await fetch('http://localhost:3000/products');
    products = await res.json();
  }

  // --- Add functions ---
  async function addCustomer() {
    if (!custName || !custEmail) {
      message = "Name & Email required";
      return;
    }
    const res = await fetch('http://localhost:3000/customers', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name: custName, email: custEmail, phone: custPhone})
    });
    if (res.ok) {
      message = "Customer added!";
      custName = custEmail = custPhone = '';
      loadCustomers();
    }
  }

  async function addStore() {
    if (!storeName || !storeLocation || !storeCustomerId) {
      message = "All fields required";
      return;
    }
    const res = await fetch('http://localhost:3000/stores', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name: storeName, location: storeLocation, customer_id: storeCustomerId})
    });
    if (res.ok) {
      message = "Store added!";
      storeName = storeLocation = '';
      storeCustomerId = null;
      loadStores();
    }
  }

  async function addProduct() {
    if (!prodName || !prodPrice || !prodStoreId) {
      message = "All fields required";
      return;
    }
    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name: prodName, price: prodPrice, store_id: prodStoreId})
    });
    if (res.ok) {
      message = "Product added!";
      prodName = '';
      prodPrice = null;
      prodStoreId = null;
      loadProducts();
    }
  }

  // --- Delete functions ---
  async function deleteCustomer(id: number) {
    const res = await fetch(`http://localhost:3000/customers/${id}`, { method:'DELETE' });
    if(res.ok) { message="Customer deleted"; loadCustomers(); }
  }

  async function deleteStore(id: number) {
    const res = await fetch(`http://localhost:3000/stores/${id}`, { method:'DELETE' });
    if(res.ok) { message="Store deleted"; loadStores(); }
  }

  async function deleteProduct(id: number) {
    const res = await fetch(`http://localhost:3000/products/${id}`, { method:'DELETE' });
    if(res.ok) { message="Product deleted"; loadProducts(); }
  }

  // --- Show selected ---
  function showTable(type: string) {
    selected = type;
    message = '';
    if(type === 'customers') loadCustomers();
    if(type === 'stores') loadStores();
    if(type === 'products') loadProducts();
  }
</script>

<h1>Welcome to EmpowerFresh</h1>

<div class="buttons">
  <button class="btn" onclick={() => showTable('customers')}>Customers</button>
  <button class="btn" onclick={() => showTable('stores')}>Stores</button>
  <button class="btn" onclick={() => showTable('products')}>Products</button>
</div>

{#if message}
  <p>{message}</p>
{/if}

<!-- CUSTOMERS TABLE -->
{#if selected === 'customers'}
  <h2>Customers</h2>
  <input bind:value={custName} placeholder="Name" />
  <input bind:value={custEmail} placeholder="Email" />
  <input bind:value={custPhone} placeholder="Phone" />
  <button class="btn" onclick={addCustomer}>Add Customer</button>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each customers as c}
        <tr>
          <td>{c.name}</td>
          <td>{c.email}</td>
          <td>{c.phone}</td>
          <td>
            <button class="delete-btn" onclick={() => deleteCustomer(c.id)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<!-- STORES TABLE -->
{#if selected === 'stores'}
  <h2>Stores</h2>
  <input bind:value={storeName} placeholder="Name" />
  <input bind:value={storeLocation} placeholder="Location" />
  <input bind:value={storeCustomerId} placeholder="Customer ID" type="number" />
  <button class="btn" onclick={addStore}>Add Store</button>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Location</th>
        <th>Customer ID</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each stores as s}
        <tr>
          <td>{s.name}</td>
          <td>{s.location}</td>
          <td>{s.customer_id}</td>
          <td>
            <button class="delete-btn" onclick={() => deleteStore(s.id)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<!-- PRODUCTS TABLE -->
{#if selected === 'products'}
  <h2>Products</h2>
  <input bind:value={prodName} placeholder="Name" />
  <input bind:value={prodPrice} placeholder="Price" type="number" />
  <input bind:value={prodStoreId} placeholder="Store ID" type="number" />
  <button class="btn" onclick={addProduct}>Add Product</button>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Store ID</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each products as p}
        <tr>
          <td>{p.name}</td>
          <td>{p.price}</td>
          <td>{p.store_id}</td>
          <td>
            <button class="delete-btn" onclick={() => deleteProduct(p.id)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  .btn {
    margin: 10px;
    padding: 8px 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
  }

  .btn:hover {
    cursor: pointer;
    background: #45a049;
  }

  table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 80%;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  .delete-btn {
    padding: 4px 8px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
  }

  .delete-btn:hover {
    cursor: pointer;
    background-color: #c0392b;
  }

  input {
    margin: 5px;
    padding: 6px;
  }

  .buttons {
    margin-bottom: 20px;
  }
</style>