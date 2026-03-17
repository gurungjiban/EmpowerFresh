<script lang="ts">
  import { onMount } from 'svelte';

  let customers = $state<any[]>([]);
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let showTable = $state(false);
  let message = $state('');

  // Load customers from backend
  async function loadCustomers() {
    const res = await fetch('http://localhost:3000/customers');
    customers = await res.json();
  }

  // Add new customer
  async function addCustomer() {
    if (!name || !email) {
      message = "Name & Email required";
      return;
    }

    const res = await fetch('http://localhost:3000/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone })
    });

    if (res.ok) {
      message = "Customer added!";
      name = '';
      email = '';
      phone = '';
      showTable = true;
      loadCustomers();
    } else {
      message = "Failed to add customer";
    }
  }

  // Delete customer
  async function deleteCustomer(id: number) {
    const res = await fetch(`http://localhost:3000/customers/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      message = "Customer deleted";
      loadCustomers();
    } else {
      message = "Failed to delete customer";
    }
  }

  onMount(loadCustomers);
</script>

<h1>Customers</h1>

<input bind:value={name} placeholder="Name" />
<input bind:value={email} placeholder="Email" />
<input bind:value={phone} placeholder="Phone" />

<button class="btn" onclick={addCustomer}>
  Add Customer
</button>

{#if message}
  <p>{message}</p>
{/if}

{#if showTable}
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
            <button class="delete-btn" onclick={() => deleteCustomer(c.id)}>
              Delete
            </button>
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
    width: 70%;
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
</style>
