<!-- CustomerForm.vue -->
<template>
   <!-- FORM -->
   <form v-if="false" class=" flex flex-col w-full gap-3 mb-12" @submit.prevent="handleSubmit">
            <!-- {{ customer }} -->
      <h1 class=" text-2xl font-bold">Add a new customer</h1>
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

      <div class=" flex flex-row gap-3">
        <div class=" w-full flex flex-col">
          <span>Customer Address</span>
          <input v-model="customer.address" placeholder="Address" required class=" p-3"/>
        </div>

        <div class=" w-full">
          <span>Customer Phone Number</span>
          <input type="phone" placeholder="Enter customer phone number" class="p-3 w-full uppercase" v-model="customer.phone"/>
        </div>

        <div class=" w-full">
          <span>Customer Regsitration Date</span>
          <input type="date" placeholder="Enter customer phone number" class="p-3 w-full uppercase" v-model="customer.reg_date"/>
        </div>
      </div>
        <Button @click="handleSubmit()" class=" w-fit">+ Add new Customer</Button>
        <hr/>
    </form>
   

 <!--    <form @submit.prevent="handleSubmit" class=" flex flex-col gap-3">
      <h2>Add Customer</h2>
      <div class=" flex gap-3">
        <input v-model="customer.name" placeholder="Name" required />
        <input v-model="customer.reg_number" placeholder="Registration No" required />
        <input v-model="customer.reg_date" type="date" required />
        <input v-model="customer.address" placeholder="Address" required />
        <input v-model="customer.phone" placeholder="Phone" required />
    
      </div>
      <Button type="submit">Add Customer</Button>
    </form> -->

       <!-- ADD NEW CUSTOMER -->
       <div v-show="new_customer_modal" class=" fixed top-0 left-0 bg-black w-full min-h-screen z-50 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center p-5">
        <div class=" w-400px bg-white rounded-lg flex flex-col gap-3 p-8">
          <span class=" text-2xl font-bold">
            Add a new customer to record ledger record
          </span>
          <!-- ERROR ALERTS HERE -->
        <!--   <Alert variant="destructive" v-if="error" class=" flex text-left flex-col justify-start">
            <ExclamationTriangleIcon class="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ error }}
            </AlertDescription>
          </Alert> -->
  
          <!-- FORM -->
          <form class=" flex flex-col w-full gap-3" @submit.prevent="handleSubmit">
            <!-- {{ customer }} -->
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
                <input v-model="customer.address" placeholder="Address" required class=" p-3"/>
              </div>

              <div class=" w-full">
                <span>Customer Phone Number</span>
                <input type="phone" placeholder="Enter customer phone number" class="p-3 w-full uppercase" v-model="customer.phone"/>
              </div>

              <div class=" w-full">
                <span>Customer Regsitration Date</span>
                <input type="date" placeholder="Enter customer phone number" class="p-3 w-full uppercase" v-model="customer.reg_date"/>
              </div>
          </form>
  
          <div class="flex flex-row gap-3 justify-end items-center">
            <Button variant="destructive" @click="[new_customer_modal = !new_customer_modal, error = '']">Close</Button>
            <Button @click="[handleSubmit(), new_customer_modal = !new_customer_modal]">Add Customer</Button>
          </div>
        </div>
      </div>

      <div class=" my-12">
        <Button @click="new_customer_modal = !new_customer_modal">+ Add new Customer</Button>
      </div>
      


 
  </template>
  
  <script>
  import { ref } from 'vue';
import Button from './ui/button/Button.vue';
  
  export default {
    name: 'CustomerForm',
    emits: ['add-customer'],
    components: {
      Button,
    },

    data(){
      return{
        customer: {
          id: Date.now().toString(), 
          name: '', 
          phone: '', 
          address: '', 
          reg_number: '', 
          reg_date: '01-10-2025', 
          balance: 0,
        },

        new_customer_modal: false,

       
        alphs: ["a", 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      }
    },

    methods: {
      handleSubmit(){
          const customers = JSON.parse(localStorage.getItem('customers')) || [];

          const nameExists = customers.some(
            (customer) => customer.name.toLowerCase() === this.customer.name.toLowerCase()
          );
  
          if (nameExists) {
            alert("sorry name exists already exists")
            // this.error = "Sorry, a customer with this name already exists";
            return null;
          }

          const idExists = customers.some(
            (customer) => customer.reg_number === this.customer.reg_number
          );

          if (idExists) {
            alert("sorry reg number already exists")
            // this.error = "Sorry, a customer with this name already exists";
            return null;
          }



        this.$emit('add-customer', { ...this.customer });
        this.customer = {
          id: Date.now().toString(),
          name: '',
          phone: '',
          address: '',
          reg_number: '',
          reg_date: '01-10-2025',
          balance: 0,
        };

        window.location.reload();
      },

      // cehck and auto apply next reg_number...
     /*  checkReg(){
        this.customers.forEach(c => {
          if(c.reg_number == )
        });
      } */
    },

  /*   setup(_, { emit }) {
      const random_id = Date.now().toString();
      const customer = ref({ id: random_id, name: '', phone: '', address: 'etche road', reg_number: '', reg_date: '', balance: 0 });
  
      const handleSubmit = () => {
        emit('add-customer', { ...customer.value });
        customer.value = { id: '', name: '', phone: '', address: '', reg_number: '', reg_date: '', balance: 0 };
      };
  
      return { customer, handleSubmit };
    }, */
  };
  </script>
  
  <style>
  form {
    margin-bottom: 20px;
  }
  </style>