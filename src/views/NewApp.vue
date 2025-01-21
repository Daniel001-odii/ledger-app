// Main Vue App (App.vue)
<template>
  <div class="app">
    <div class="">
        <span><i class="bi bi-google-play"></i> LedgerApp</span>
        <p class=" text-5xl uppercase">{{ user.company_name }}</p>
    </div>
  
      <div class="flex flex-row mt-12">
        <div class=" flex flex-col">
            <span>Welcome,</span>
            <span class=" font-bold text-3xl capitalize">{{ user.name }}</span>
        </div>
      </div>
  
  
      <!-- HEADER AREA -->
       <div class=" flex flex-row flex-wrap gap-4 mt-6 mb-12">
          <!-- STAT BOX -->
           <div class=" stat_box bg-green-500 text-white">
              <i class="bi bi-person text-3xl"></i>
              <div class=" flex flex-col">
                <span class="">total customers</span>
                <span class=" text-3xl">{{ all_customers }}</span>
              </div>
           </div>
  
           <!-- STAT BOX -->
           <div class=" stat_box bg-blue-500 text-white">
              <i class="bi bi-cash-stack text-3xl"></i>
              <div class=" flex flex-col">
                <span class="">total balance/income</span>
                <span class=" text-3xl">{{ total_balance.toLocaleString() }}</span>
              </div>
           </div>
       </div>

    <!-- <h1>Accounting Application</h1> -->
    <customer-form @add-customer="addCustomer" />
    <transaction-form :customers="customers" @add-transaction="addTransaction" />
    <!-- LEDGER GROUPS -->
    <div class=" flex flex-col mt-12 gap-3">
      <h2 class=" font-bold text-2xl">All Ledger Groups</h2>
      <div class=" flex flex-row flex-wrap gap-3">
        <RouterLink :to="`/group/${group}`" v-for="group in  getAllRegNumberGroups()">
          <Button class=" uppercase"> Group {{ group }} <i class="bi bi-arrow-right"></i></Button>
        </RouterLink>
      </div>
    </div>
    <customer-table :customers="customers" />
    <input type="file" @change="uploadToLocalStorage" accept=".json" />
    <Button @click="saveLocalStorageToFile">Download File</Button>
 
  </div>
</template>

<script>
import { ref } from 'vue';
import CustomerForm from '@/components/CustomerForm';
import TransactionForm from '@/components/TransactionForm';
import CustomerTable from '@/components/CustomerTable';
import Button from '@/components/ui/button/Button.vue';


export default {
  name: 'App',
  components: { CustomerForm, TransactionForm, CustomerTable, Button },
  data(){
    return{
      customers: JSON.parse(localStorage.getItem('customers')) || [],
      user: {
          name: '',
          company_name: ''
      },
      all_customers: '',
      total_balance: '',
    }
  },
  methods: {
    
    loadUSerData(){
        const user = JSON.parse(localStorage.getItem("finance_app_user")) || {name: '', company_name: ''};
        this.user = user;
        if(!user.name || !user.company_name){
            this.registration_modal = true;
        } else {
          this.registration_modal = false;
        }
    },

    getAllRegNumberGroups() {
        const customers = JSON.parse(localStorage.getItem("customers")) || [];
        const groups = new Set();

        customers.forEach((customer) => {
            if (customer.reg_number) {
                const group = customer.reg_number.charAt(0); // Get the first character of the reg_number
                groups.add(group);
            }
        });

        return Array.from(groups).sort(); // Return sorted groups (e.g., ["A", "B", "C"])
    },

     // get stats...
     getAllCustomersAndBalance() {
      // Fetch customers from local storage or initialize as an empty array
      const customers = JSON.parse(localStorage.getItem("customers")) || [];
      
      // Initialize variables to store results
      // Initialize variables to calculate total income
      const totalBalance = customers.reduce((sum, customer) => {
        // Calculate total deposits for this customer
        const totalDeposits = (customer.transactions || [])
          .filter((transaction) => transaction.type === "deposit")
          .reduce((depositSum, transaction) => depositSum + transaction.amount, 0);

        return sum + totalDeposits;
      }, 0);

      this.all_customers = customers.length
      this.total_balance = totalBalance;
    /*   return {
        customers,     // Array of all customers
        totalBalance,  // Total balance across all customers
      }; */
    },

    saveLocalStorageToFileOld() {
      // Step 1: Get all data from localStorage
      const localStorageData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageData[key] = localStorage.getItem(key);
      }

      // Step 2: Convert the data to a JSON string
      const jsonData = JSON.stringify(localStorageData, null, 2);

      // Step 3: Create a Blob and generate a download link
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Step 4: Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "ledger-app-file.json"; // Set the file name
      document.body.appendChild(link);
      link.click();

      // Step 5: Clean up the link
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },

    saveLocalStorageToFile() {
      // Step 1: Get the data for the "customers" key from localStorage
      const customersData = localStorage.getItem("customers");

      if (!customersData) {
        alert("No data found for 'customers' in localStorage.");
        return;
      }

      // Step 2: Convert the data to a JSON string (if it's not already a string)
      const jsonData = JSON.stringify(JSON.parse(customersData), null, 2);

      // Step 3: Create a Blob and generate a download link
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Step 4: Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "customers-data.json"; // Set the file name
      document.body.appendChild(link);
      link.click();

      // Step 5: Clean up the link
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },


    uploadToLocalStorage(event) {
      const file = event.target.files[0]; // Get the uploaded file

      if (file) {
        try {
          // Step 1: Read the file content
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              // Step 2: Parse the JSON content
              const data = JSON.parse(e.target.result);

              // Step 3: Validate the data structure (ensure it fits the "customers" format)
              if (typeof data === "object" && data !== null) {
                // Save to localStorage under the "customers" key
                localStorage.setItem("customers", JSON.stringify(data));
                alert("'customers' data has been successfully restored to localStorage!");
                window.location.reload();
              } else {
                alert("Invalid file format. Please upload a valid JSON file.");
              }
            } catch (parseError) {
              console.error("Error parsing the file:", parseError);
              alert("Failed to parse the file. Ensure it contains valid JSON.");
            }
          };

          reader.onerror = (readError) => {
            console.error("Error reading the file:", readError);
            alert("Failed to read the file. Please try again.");
          };

          // Read the file content as text
          reader.readAsText(file);
        } catch (error) {
          console.error("Error uploading the file:", error);
          alert("An error occurred while uploading the file.");
        }
      } else {
        alert("No file selected. Please choose a file to upload.");
      }
    },


    // Helper method to read the file using FileReader
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result); // File content
        reader.onerror = (e) => reject(e);
        reader.readAsText(file); // Read as plain text
      });
    },
  },

  mounted(){
    this.loadUSerData();
    this.getAllCustomersAndBalance()
  }, 
  setup() {
    const customers = ref(JSON.parse(localStorage.getItem('customers')) || []);

    const saveToLocalStorage = () => {
      localStorage.setItem('customers', JSON.stringify(customers.value));
    };

    const addCustomer = (customer) => {
      console.log("cusotmer from template: ", customer)
      customers.value.push({ ...customer, transactions: [] });
      
      // check if customer wuth ID already exists..
     /*  const existing_customer = customers.value.find((c) => c.reg_number === customer.reg_number);
      if(existing_customer){
        alert("customer already exists!")
        return false
      } */
      saveToLocalStorage();
    };

    const addTransaction = ({ customerId, transaction }) => {
      console.log("emitted function values: ", customerId, transaction)
      const customer = customers.value.find((c) => c.id === customerId);
      if (customer) {
        customer.transactions.push(transaction);
        if(transaction.type === 'deposit'){
          customer.balance = Number(customer.balance) + Number(transaction.amount);
        } else if(transaction.type === 'withdrawal'){
          customer.balance = Number(customer.balance) - Number(transaction.amount);
        }
        saveToLocalStorage();
      }
    };

    return { customers, addCustomer, addTransaction };
  },
};
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  margin: 20px;
}
</style>