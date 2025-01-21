<template>
  <!-- CUSTOMER EDIT MODAL -->
  <div v-show="edit_customer_modal" class=" fixed top-0 left-0 bg-black w-full min-h-screen z-50 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center p-5">
        <div class=" max-w-[700px] bg-white rounded-lg flex flex-col gap-3 p-8 w-full">
          <h1 class=" font-bold text-2xl">Edit Customer Information</h1>
            <div class=" flex flex-row gap-3">
                <div class=" w-full flex-1">
                  <span>Customer name</span>
                  <input type="text" placeholder="Enter customer name here" class="p-3 w-full uppercase border" v-model="customer.name"/>
                </div>

                <div class=" flex flex-col">
                  <span>Reg. Number</span>
                  <input type="text" placeholder="Enter customer REG. number" class="p-3 uppercase w-[100px]" v-model="customer.reg_number"/>
                </div>
            </div>

            <div class=" w-full flex flex-col">
                <span>Customer Address</span>
                <input type="text" placeholder="enter customer address here" v-model="customer.address"  class="p-3 w-full uppercase">
              </div>

            <div class=" w-full">
              <span>Customer Phone Number</span>
              <input type="phone" placeholder="Enter customer phone number" class="p-3 w-full uppercase" v-model="customer.phone"/>
            </div>

            <div class=" w-full">
              <span>Customer Balance</span>
              <input type="number" placeholder="Enter customer balance here" class="p-3 w-full uppercase" v-model="customer.balance"/>
            </div>
            <div class="flex flex-row gap-3 justify-end items-center">
            <Button variant="destructive" @click="[edit_customer_modal = !edit_customer_modal, error = '']">Close</Button>
            <Button @click="editCustomer(customer.id)">Save changes</Button>
          </div>
        </div>
  </div>

  <!-- DELTE CUSTOMER MODAL -->
  <div v-show="delete_customer_modal" class=" fixed top-0 left-0 bg-black w-full min-h-screen z-50 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center p-5">
    <div class=" max-w-[700px] bg-white rounded-lg flex flex-col gap-3 p-8 w-full">
      <h1 class=" font-bold text-2xl">Are your sure you want to delete {{ customer.name }} </h1>
        <div class="flex flex-row gap-3 justify-end items-center">
        <Button variant="destructive" @click="[delete_customer_modal = !delete_customer_modal, error = '']">Close</Button>
        <Button @click="[deleteCustomer(customer.id), delete_customer_modal = !delete_customer_modal]">Yes Delete</Button>
      </div>
    </div>
  </div>


  
  
  
  <div class=" mt-12" id="table">
    <div class=" flex flex-row items-center justify-between">
      <h2 class=" font-bold text-3xl">Customers and Transactions</h2>
      <Button variant="outline" @click="printSheet"> <i class="bi bi-printer"></i> Print Sheet</Button>
    </div>
  

    <div class=" flex flex-row items-center justify-between py-6" >
      <h3 class=" font-bold text-3xl">Week: {{ groupedTransactions[current_week]?.startDate }} - {{ groupedTransactions[current_week]?.endDate }}</h3>
      <div class=" flex flex-row gap-4">
        <Button @click="[current_week --, changeCurrentWeek(current_week)]" :disabled="current_week == 0">Previous</Button>
        <Button @click="[current_week ++, changeCurrentWeek(current_week)]" :disabled="current_week == groupedTransactions.length - 1">Next</Button>
      </div>
    </div>


    <div class="week-table  h-[500px] overflow-y-auto" v-if="groupedTransactions.length > 0" >
      <!-- <div class="week-table  h-[500px] overflow-y-auto"> -->
      <table >
        <thead>
          <tr>
            <th>S/N</th>
            <th >Customer Name</th>
            <th>Reg No</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Withdrawals</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in customers" :key="customer.id" class=" text-left">
            <td>{{ index + 1 }}</td>
            <td class=" text-left">
              <RouterLink  :to="`/customers/${item.id}`" class=" hover:underline hover:text-blue-500">
                {{ item.name }}
              </RouterLink>
            </td>
            <td class=" text-left">{{ item.reg_number }}</td>
            <td v-for="day in days" :key="day" class=" text-right">
              {{ getTransactionSummary(item, groupedTransactions[current_week], day) }}
            </td>
            <td class=" text-right">{{ getWithdrawals(item, groupedTransactions[current_week]) }}</td>
            <!-- <tr> -->
              <!-- <td v-for="wd in  getWithdrawals(customer, week)">{{ wd }}</td> -->
            <!-- </tr> -->
            
            <td class=" text-right">{{ item.balance }}</td>
            <td>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button>
                    <i class="bi bi-three-dots"></i>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem @click="[edit_customer_modal = !edit_customer_modal, customer = item]">Edit customer</DropdownMenuItem>
                  <DropdownMenuItem @click="[withdrawal_modal = !withdrawal_modal, customer.id = item.id]">Withdraw funds</DropdownMenuItem>
                  <DropdownMenuItem  @click="[delete_customer_modal = !delete_customer_modal, customer.id = item.id, customer.name = item.name]" class="bg-red-500 text-white">Delete customer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import Button from './ui/button/Button.vue';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'


export default {
  name: 'CustomerTable',
  props: ['customers'],

  components: {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  },

  data(){
    return{
      current_week: 0,
      customer: {
            id: '',
            name: '',
            balance: 0,

            reg_number: '',
            address: '',
            phone: '',
            reg_date: new Date().toISOString(),

            transaction: [
              {
                type: '',
                amount: '',
              }
            ]
          },
          selectedWeek: `${this.groupedTransactions[this.current_week]?.startDate } - ${ this.groupedTransactions[this.current_week]?.endDate }`,
      edit_customer_modal: false,
      delete_customer_modal: false,
    }
  },

  methods: {
    updateCustomer(customerId) {
          // const customerId = "1234567890"; // Replace with the actual customer ID
          const updatedInfo = this.customer;

          const success = this.editCustomer(customerId, updatedInfo);
          if (success) {
            alert("customer updated successfully!")
            console.log("Customer updated successfully!");
            this.loadCustomers(); // Refresh the customer list if needed
          } else {
            console.error("Failed to update customer");
            alert("failed to edit customer")
          };

          this.edit_customer_modal = false;
      },

    editCustomer(customerId) {
      const updatedInfo = this.customer;
      // Retrieve existing customers from localStorage
      const customers = JSON.parse(localStorage.getItem("customers")) || [];
      
      // Find the customer by ID
      const customerIndex = customers.findIndex(customer => customer.id === customerId);
      
      if (customerIndex === -1) {
        console.error("Customer not found");
        alert("customer not found")
        return false; // Return false if the customer is not found
      }
      
      // Update the customer information
      customers[customerIndex] = {
        ...customers[customerIndex], // Preserve existing properties
        ...updatedInfo,             // Overwrite with updated properties
      };
      
      // Save updated customers back to localStorage
      localStorage.setItem("customers", JSON.stringify(customers));

      alert("customer updated")
      window.location.reload();
      console.log("Customer updated:", customers[customerIndex]);
      return true; // Return true if the operation was successful
    },

    deleteCustomer(customerId) {
      // Retrieve existing customers from localStorage
      const customers = JSON.parse(localStorage.getItem("customers")) || [];

      // Find the customer index
      const customerIndex = customers.findIndex(customer => customer.id === customerId);

      if (customerIndex === -1) {
        alert("Customer not found");
        console.error("Customer not found");
        return false; // Return false if the customer doesn't exist
      }

      // Remove the customer from the array
      customers.splice(customerIndex, 1);

      // Save updated customers back to localStorage
      localStorage.setItem("customers", JSON.stringify(customers));

      alert(`Customer with ID ${customerId} deleted successfully.`)
      console.log(`Customer with ID ${customerId} deleted successfully.`);
      window.location.reload();
      // this.loadCustomers();
      return true; // Return true to indicate success
    },

    changeCurrentWeek(week){
      if(this.current_week < this.groupedTransactions.length - 1){
        localStorage.setItem("current_week", week);
      }
    },

    printSheet(){
            const table = document.getElementById("table").outerHTML;
            const print_window = window.open("", "_blank");
            print_window.document.write(`
                <html>
                    <head>
                        <title>Ledger Record For Week ${this.groupedTransactions[this.current_week]?.startDate } - ${ this.groupedTransactions[this.current_week]?.endDate }</title>
                    </head>
                    <style>
                     @page {
                        size: landscape;
                    }
                        table{
                        width: 100%;
                        border-collapse: collapse;
                    }
                        th, td {
                        border: 1px solid black;
                        padding: 8px;
                    }
                    </style>
                    <body>
                        <h3>Ledger Record for week ${this.groupedTransactions[this.current_week]?.startDate } - ${ this.groupedTransactions[this.current_week]?.endDate }</h3>
                        ${table}
                    </body>
                </html>
            `);
            print_window.document.close();
            print_window.focus();
            print_window.print();
            print_window.close();
        },
  },


  mounted(){
    this.current_week = localStorage.getItem("current_week") ? localStorage.getItem("current_week"):0;
  },

  setup(props) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getStartOfWeek = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday start
      return new Date(d.setDate(diff));
    };

   /*  const calculateWeekNumber = (date) => {
      const startDate = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
      return Math.ceil((days + startDate.getDay() + 1) / 7);
    }; */

    const groupedTransactions = computed(() => {
  const transactionsByWeek = {};
  
  props.customers.forEach((customer) => {
    customer.transactions.forEach((transaction) => {
      const startOfWeek = getStartOfWeek(transaction.date).toISOString().split('T')[0];
      if (!transactionsByWeek[startOfWeek]) {
        transactionsByWeek[startOfWeek] = { startDate: startOfWeek, transactions: [] };
      }
      transactionsByWeek[startOfWeek].transactions.push({ ...transaction, customer });
    });
  });

  // Convert the object to an array, sort by start date, and map to include endDate
  return Object.values(transactionsByWeek)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) // Sort by startDate
    .map((week) => {
      const endDate = new Date(week.startDate);
      endDate.setDate(endDate.getDate() + 6);
      week.endDate = endDate.toISOString().split('T')[0];
      return week;
    });
});


    const getTransactionSummary = (customer, week, day) => {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const dayTransactions = week.transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        const transactionDay = weekdays[transactionDate.getDay()];
        return (
          t.customer.id === customer.id && transactionDay === day && t.type !== 'withdrawal'
        );
      });

      return dayTransactions.map((t) => t.amount).join(', ') || '-';
    };

    const getWithdrawals = (customer, week) => {
      const withdrawals = week.transactions.filter(
        (t) => t.customer.id === customer.id && t.type === 'withdrawal'
      );

      // return withdrawals.map((w) => `${w.amount} (${w.date})`).join(',') || '-';
      return withdrawals.map((w) => `${w.amount}`).join(' | ') || '-';
    };

    return { days, groupedTransactions, getTransactionSummary, getWithdrawals };
  },
};
</script>

<style>
.week-table {
  margin-bottom: 40px;
}
table {
  width: 100%;
  border-collapse: collapse;
  @apply uppercase
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
  @apply text-left
}
</style>
