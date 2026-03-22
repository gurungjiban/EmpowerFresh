<script lang="ts">
  import { onMount } from 'svelte';

  let products = $state<any[]>([]);
  let name = $state('');
  let price = $state('');
  let store_id = $state('');
  let showTable = $state(false);
  let message = $state('');

  async function loadProducts() {
    try {
      const res = await fetch('http://localhost:3000/products');
      products = await res.json();
    } catch (err) {
      message = 'Failed to load products';
    }
  }

  async function addProduct() {
    if (!name || !price || !store_id) {
      message = 'All fields required';
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //name,
          //price: Number(price),
          //store_id: Number(store_id)
        })
      });

      if (res.ok) {
        message = 'Product added!';
        name = '';
        price = '';
        store_id = '';
        showTable = true;
        loadProducts();
      } else {
        message = 'Failed to add product';
      }
    } catch (err) {
      message = 'Server error';
    }
  }

  async function deleteProduct(id: number) {
    
    const res = await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
    if(res.ok) {
      message = 'Product deleted';
      loadProducts();
    } else {
      message = 'Failed to delete product';
    }
  }

  onMount(loadProducts);
</script>

<h1>Products</h1>

<input bind:value={name} placeholder="Product Name" />
<input bind:value={price} placeholder="Price" />
<input bind:value={store_id} placeholder="Store ID" />

<button class="btn" onclick={addProduct}>Add Product</button>

{#if message}
  <p>{message}</p>
{/if}

{#if showTable}
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
    margin: 5px;
    padding: 6px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
  }
  .btn:hover {
    cursor: pointer;
    background-color: #45a049;
  }
  .delete-btn {
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
  }
  .delete-btn:hover {
    cursor: pointer;
    background-color: #d32f2f;
  }
  table {
    margin-top: 10px;
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
  }
</style>
