<!-- TransactionForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class=" flex flex-col gap-3 border p-12">
    <h2 class=" text-2xl font-bold">Add A New Transaction</h2>
     <!-- SELECT CUSTOMER -->

  <div class=" flex flex-row flex-wrap gap-3 items-end">
      <div class=" w-fit flex flex-col gap-3">
          <span>Select A Customer</span>
          <select v-model="selectedCustomerId" required @change="selectCustomer" class=" p-3 border">
            <option value="" disabled>Select customer here</option>
            <option v-for="customer in customers" :key="customer.reg_no" :value="customer.id">
              {{ customer.name }} ({{ customer.reg_number }})
            </option>
          </select>
      </div>

    <!-- <div class=" flex flex-row gap-6"> -->
      <div class=" flex flex-col gap-3 flex-1">
        <span class=" flex ">Select transaction type</span>
        <select v-model="transaction.type" required class=" p-3 border">
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </div>

      <div class=" flex flex-col gap-3 flex-1">
        <span class=" flex ">Transaction date</span>
        <input v-model="transaction.date" type="date" required class=" p-3 border"/>
      </div>

      <div class=" flex flex-col gap-3 flex-1">
        <span class=" flex ">Transaction amount</span>
        <input v-model.number="transaction.amount" type="number" placeholder="Amount" required class=" p-3 border"/>
      </div>
    <!-- </div> -->
    <Button type="submit" class=" w-fit">Add Transaction</Button>
    
  </div>
   
  </form>

<!-- {{ selectedCustomerId }} -->
</template>

<script>
import { ref } from 'vue';
import Button from './ui/button/Button.vue';

  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
  } from '@/components/ui/command'
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover'
  import { cn } from '@/lib/utils'



export default {
  name: 'TransactionForm',
  props: ['customers'],
  emits: ['add-transaction'],
  components: {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger,
  },
  data(){
    return{
      cn,
      bulk_transactions: false,
      no_of_transactions: 2,
      numbers: [2,3,4,5,6],
      open: false,
      value: '',
      selectedCustomerId: '', // Currently selected customer
      bulk_transact: [
        { id: Date.now().toString(), 
          date: '', 
          amount: 0 ,
          type: 'deposit',
        }, // Default transaction
      ],
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
    }
  },

  methods: {
    addTransaction() {
      // Add a new transaction object
      this.bulk_transact.push({ id: Date.now().toString(), type: 'deposit', date: '', amount: 0 });
    },
    removeTransaction(index) {
      // Remove a specific transaction by index
      this.bulk_transact.splice(index, 1);
    },


    selectCustomer(){
      console.log("selected customer: ",  this.selectedCustomerId)
    },

    submitTransactions() {
      if (!this.selectedCustomerId) {
        alert('Please select a customer.');
        return;
      }

      // Validate transactions
      const validTransactions = this.bulk_transact.filter(
        (trans) => trans.date && trans.amount > 0
      );

      if (validTransactions.length === 0) {
        alert('Please fill out all transaction details.');
        return;
      }

      // Emit the transactions
      this.$emit('add-transaction', {
        customerId: this.selectedCustomerId,
        transactions: validTransactions,
      });

      // Reset the form
      this.bulk_transact = [{ date: '', amount: 0 }];
    },

    handleSubmit () {
      // Assign unique ID for the transaction
      this.transaction.id = Date.now().toString();
      this.transaction.time = new Date();

      // Emit event with the selected customer ID and the transaction data
      this.$emit('add-transaction', { customerId: this.selectedCustomerId, transaction: { ...this.transaction } });

      // Reset form inputs for a new transaction
      this.transaction = { id: '', type: 'deposit', date: '', amount: 0, time: '' };
      this.selectedCustomerId = ''; // Reset selected customer
    },
  },

  setup(props, { emit }) {
    const id = ref('');
    // defining transaction variable...
    const transaction = ref({ id: Date.now().toString(), type: 'deposit', date: '', amount: 0, time: '' });
    return { id, transaction };
  },
};
</script>

<style>
form {
  margin-bottom: 20px;
}
</style>