<script lang="ts">
  import { onMount } from 'svelte';

  // State variables
  let stores: any[] = [];
  let name = '';
  let location = '';
  let customer_id = '';
  let showTable = false;
  let message = '';

  // Load stores from backend
  async function loadStores() {
    try {
      const res = await fetch('http://localhost:3000/stores');
      stores = await res.json();
    } catch (err) {
      message = 'Failed to load stores';
    }
  }

  // Add a new store
  async function addStore() {
    if (!name || !location || !customer_id) {
      message = 'All fields required';
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          customer_id: Number(customer_id) // convert to number
        })
      });

      if (res.ok) {
        message = 'Store added!';
        name = '';
        location = '';
        customer_id = '';
        showTable = true;
        loadStores();
      } else {
        message = 'Failed to add store';
      }
    } catch (err) {
      message = 'Server error';
    }
  }

  // Delete store
  async function deleteStore(id: number) {
    
    const res = await fetch(`http://localhost:3000/stores/${id}`, { method: 'DELETE' });
    if (res.ok) {
      message = 'Store deleted';
      loadStores();
    } else {
      message = 'Failed to delete store';
    }
  }
  onMount(loadStores);
</script>

<h1>Stores</h1>

<input bind:value={name} placeholder="Store Name" />
<input bind:value={location} placeholder="Location" />
<input bind:value={customer_id} placeholder="Customer ID" />

<button class="btn" onclick={addStore}>Add Store</button>

{#if message}
  <p>{message}</p>
{/if}

{#if showTable}
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