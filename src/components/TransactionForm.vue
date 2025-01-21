<!-- TransactionForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class=" flex flex-col gap-3">
    <h2 class=" text-2xl font-bold">Add A New Transaction</h2>
     <!-- SELECT CUSTOMER -->

  <div class=" flex flex-col gap-3 flex-wrap">
      <div class=" w-fit">
        <span>Select A Customer</span>
        <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                class="w-full p-3 justify-between uppercase"
              >
                {{ value ? customers.find((customer) => customer.name === value)?.name : 'Choose Customer to Deposit' }}

                <i class=" bi bi-chevron-expand"></i>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-full p-0">
              <Command v-model="value" class=" w-full">
                <CommandInput placeholder="Search for customers by name" />
                <CommandEmpty>No customers found</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="item in customers"
                      :key="item.name"
                      :value="item.name"
                      @select="[open = false, customer.id = item.id]"
                      class="uppercase"
                    >
                      <i
                        :class="cn(
                          'mr-2 h-4 w-4 bi bi-check',
                          value === item.name ? 'opacity-100' : 'opacity-0',
                        )"
                      />
                      {{ item.name }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
        </Popover>
      </div>

<!--     <select v-model="id" required @change="selectCustomer">
      <option v-for="customer in customers" :key="customer.reg_no" :value="customer.id">
        {{ customer.name }} ({{ customer.reg_no }})
      </option>
    </select> -->

    <div class=" flex flex-row gap-6">
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
    </div>

    
  </div>
    <Button type="submit" class=" w-fit">Add Transaction</Button>
  </form>
  <div class=" flex flex-col gap-3" v-if="false">
    <label class=" flex flex-row-reverse gap-3 border w-fit">
      <span>Add bulk deposit transaction</span>
      <input type="checkbox" v-model="bulk_transactions"/>
    </label>
  
    <div v-if="bulk_transactions" class=" flex flex-col w-fit gap-3">
      {{ selectedCustomerId }}<br/>
      {{ bulk_transact }}

      <!-- form -->
     <!-- Form -->
  <div>
    <div class="flex flex-col w-fit">
      <select v-model="selectedCustomerId" required @change="selectCustomer" class="border p-3">
        <option value="" disabled>Select customer</option>
        <option v-for="customer in customers" :key="customer.reg_no" :value="customer.id">
          {{ customer.name }} ({{ customer.reg_no }})
        </option>
      </select>
    </div>

    <div class=" flex flex-row flex-wrap gap-6 mt-6">
      <!-- Bulk Transaction Inputs -->
      <div v-for="(transaction, index) in bulk_transact" :key="index" class="flex flex-col gap-3 max-w-[200px]">
        <input v-model="transaction.date" type="date" required />
        <input v-model.number="transaction.amount" type="number" placeholder="Amount" required />
        <button @click="removeTransaction(index)" class="text-red-500">Remove</button>
      </div>
    </div>

    <!-- Add/Submit Buttons -->
    <div class="flex flex-row gap-3 mt-3">
      <button @click="addTransaction" class="bg-blue-500 text-white p-2">Add Another Transaction</button>
      <button @click="submitTransactions" class="bg-green-500 text-white p-2">Add Bulk Transaction</button>
    </div>
  </div>
  </div>
</div>
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
  },

  setup(props, { emit }) {
    const id = ref('');
    // defining transaction variable...
    const transaction = ref({ id: Date.now().toString(), type: 'deposit', date: '', amount: 0, time: '' });

    const handleSubmit = () => {
      // Assign unique ID for the transaction
      transaction.value.id = Date.now().toString();
      transaction.value.time = new Date();

      // Emit event with the selected customer ID and the transaction data
      emit('add-transaction', { customerId: id.value, transaction: { ...transaction.value } });

      // Reset form inputs for a new transaction
      transaction.value = { id: '', type: 'deposit', date: '', amount: 0, time: '' };
      id.value = ''; // Reset selected customer
    };

    const selectCustomer = ()=>{
      console.log("customer selected: ", id.value);
    }

    return { id, transaction, handleSubmit, selectCustomer };
  },
};
</script>

<style>
form {
  margin-bottom: 20px;
}
</style>