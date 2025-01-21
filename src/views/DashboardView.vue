<template>

    <!-- REGISTER MODAL -->
    <div v-show="registration_modal" class=" fixed top-0 left-0 bg-black w-full min-h-screen z-50 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center p-5">
        <div class=" max-w-[700px] bg-white rounded-lg flex flex-col gap-3 p-8 w-full">
            <div class= "flex flex-col">
                <span><i class="bi bi-google-play"></i> LedgerApp</span>
                <span class=" text-4xl font-bold">Registration</span>
            </div>
            
            <div class=" flex flex-col mt-6">
                <span>Your Name</span>
                <input type="text" placeholder="your company name here" class=" p-3 border bg-gray-50 rounded-md uppercase" v-model="user.name"/>
            </div>
            <div class=" flex flex-col">
                <span>Company name</span>
                <input type="text" placeholder="your company name here" class=" p-3 border bg-gray-50 rounded-md uppercase" v-model="user.company_name"/>
            </div>
            <Button @click="setUserDetails">Get Started</Button>
        </div>
    </div>


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
                <select v-model="customer.address" class=" p-3 border uppercase">
                  <option value="" disabled>Select Address</option>
                  <option v-for="item in address">{{ item }}</option>
                </select>
              </div>

            <div class=" w-full">
              <span>Customer Phone Number</span>
              <input type="phone" placeholder="Enter customer phone number" class="p-3 w-full uppercase" v-model="customer.phone"/>
            </div>
            <div class="flex flex-row gap-3 justify-end items-center">
            <Button variant="destructive" @click="[edit_customer_modal = !edit_customer_modal, error = '']">Close</Button>
            <Button @click="updateCustomer(customer.id)">Save changes</Button>
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

    <!-- DEPOSIT MODAL -->
    <div v-show="deposit_modal" class=" fixed top-0 left-0 bg-black w-full min-h-screen z-50 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center p-5">
        <div class=" w-400px bg-white rounded-lg flex flex-col gap-3 p-8">
          <span class=" text-2xl font-bold">
            Select the customer that wants to deposit funds today
          </span>
          <!-- ERROR ALERTS HERE -->
          <Alert variant="destructive" v-if="error" class=" flex text-left flex-col justify-start">
            <ExclamationTriangleIcon class="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ error }}
            </AlertDescription>
          </Alert>
  
          <!-- FORM -->
          <form class=" flex flex-col gap-3 w-full" @submit.prevent="addNewCustomer">
            <span>Search for a customer by name</span>
            {{ date_of_deposit }}
              <!-- SELECT CUSTOMER -->
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
  
              <div class=" flex flex-col">
                  <span>Amount deposited</span>
                  <input type="number" placeholder="NGN 500,000" class="p-3" v-model="amount"/>
              </div>

              <div class=" flex flex-col">
                  <span>Date of deposit</span>
                  <input type="date" placeholder="NGN 500,000" class="p-3" v-model="date_of_deposit"/>
              </div>
          </form>
  
          <div class="flex flex-row gap-3 justify-end items-center">
            <Button variant="destructive" @click="[deposit_modal = !deposit_modal, error = '']">Close</Button>
            <Button @click="newDepositTransaction(customer.id, 'deposit')">Add Deposit</Button>
          </div>
        </div>
    </div>
  
  
    <!-- WITHDRAWAL MODAL -->
    <div v-show="withdrawal_modal" class=" fixed top-0 left-0 bg-black w-full min-h-screen z-50 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center p-5">
        <div class=" w-400px bg-white rounded-lg flex flex-col gap-3 p-8">
          <span class=" text-2xl font-bold">
            Enter how much funds customer was withdrawn today
          </span>
          <!-- ERROR ALERTS HERE -->
          <Alert variant="destructive" v-if="error" class=" flex text-left flex-col justify-start">
            <ExclamationTriangleIcon class="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ error }}
            </AlertDescription>
          </Alert>
  
          <!-- FORM -->
          <form class=" flex flex-col gap-3 w-full" @submit.prevent="">
              <div class=" flex flex-col">
                  <span>Amount withdrawn</span>
                  <input type="number" placeholder="NGN 500,000" class="p-3" v-model="amount"/>
              </div>
          </form>
  
          <div class="flex flex-row gap-3 justify-end items-center">
            <Button variant="destructive" @click="[withdrawal_modal = !withdrawal_modal, error = '']">Close</Button>
            <Button @click="newWDTransaction(customer.id, 'withdrawal')">Save withdrawal</Button>
          </div>
        </div>
    </div>
  
    <!-- ADD NEW CUSTOMER -->
    <div v-show="new_customer_modal" class=" fixed top-0 left-0 bg-black w-full min-h-screen z-50 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center p-5">
        <div class=" w-400px bg-white rounded-lg flex flex-col gap-3 p-8">
          <span class=" text-2xl font-bold">
            Add a new customer to record ledger record
          </span>
          <!-- ERROR ALERTS HERE -->
          <Alert variant="destructive" v-if="error" class=" flex text-left flex-col justify-start">
            <ExclamationTriangleIcon class="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ error }}
            </AlertDescription>
          </Alert>
  
          <!-- FORM -->
          <form class=" flex flex-col w-full gap-3" @submit.prevent="addNewCustomer">
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
                <select v-model="customer.address" class=" p-3 border uppercase">
                  <option value="" disabled>Select Address</option>
                  <option v-for="item in address">{{ item }}</option>
                </select>
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
            <Button @click="[addNewCustomer(), new_customer_modal = !new_customer_modal]">Add Customer</Button>
          </div>
        </div>
    </div>
  
  
   
  
  
<div class=" flex flex-col my-8 min-h-screen">
    
    <div class="border rounded-lg p-5 shadow-sm">
        <span><i class="bi bi-google-play"></i> LedgerApp</span>
        <p class=" text-5xl uppercase">{{ user.company_name }}</p>
    </div>
  
      <div class="flex flex-row mt-12 px-5">
        <div class=" flex flex-col">
            <span>Welcome,</span>
            <span class=" font-bold text-3xl capitalize">{{ user.name }}</span>
        </div>
      </div>
  
  
      <!-- HEADER AREA -->
       <div class=" flex flex-row flex-wrap gap-4 mt-12 !px-6">
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
  
  
        <!-- ACTION TOOL BAR -->
       
        <div class=" flex flex-col mt-12 gap-3">
          <h2 class=" font-bold">Actions</h2>
          <div class=" flex flex-row flex-wrap gap-3">
            <!-- ADD NEW CUSTOMER -->
            <Button @click="new_customer_modal = !new_customer_modal"> <i class="bi bi-person"></i> Add new customer</Button>
  
  
            <!-- DEPOSIT FUNDS -->
              <Button class="" @click="deposit_modal = !deposit_modal"> <i class="bi bi-cash-stack"></i> Deposit funds</Button>
              <Button variant="secondary" @click="deposit_modal = !deposit_modal" disabled> <i class="bi bi-graph-up-arrow"></i> See Statistics</Button>
            
          </div>
        </div>

        <!-- LEDGER GROUPS -->
        <div class=" flex flex-col mt-12 gap-3">
          <h2 class=" font-bold">All Ledger Groups</h2>
          <div class=" flex flex-row flex-wrap gap-3">
            <RouterLink :to="`/group/${group}`" v-for="group in  getAllRegNumberGroups()">
              <Button >{{ group }}</Button>
            </RouterLink>
          </div>
        </div>
        <!-- Ledger Groups - {{ }} -->
  
  
        <!-- SEARCH AREA -->
        <div class="relative w-full mt-12 flex justify-between items-center">
            <div class=" relative w-full max-w-sm">
                <Input id="search" type="text" placeholder="Search for a customer here..." class="pl-10" v-model="searchQuery"/>
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <MagnifyingGlassIcon class="size-6 text-muted-foreground" />
                </span>
            </div>
            <Button variant="outline" @click="printSheet"> <i class="bi bi-printer"></i> Print Sheet</Button>
        </div>
  
  <!-- <span>customer id: {{ customer.id }}</span> -->
  
  
       <!-- DATA DISPLAY AREA -->
        <div class=" flex flex-col mt-12">
          <div class=" flex flex-row justify-between">
            <div class=" flex flex-col">
              <small>{{ time_stat.month }}</small>
              <h1 class=" text-3xl font-bold">{{ time_stat.day }}</h1>
            </div>
        
  
            <!-- WEEK SELECTOR -->
            <select v-model="selectedWeek" class=" border rounded-lg px-4">
              <option v-for="week in availableWeeks" :key="week" :value="week">
                Week {{ week }}
              </option>
            </select>
  
          </div>
         
          <Table class=" border border-t mt-3" ref="printable_table" id="table">
            <!-- <TableCaption>A list of customers and transactions.</TableCaption> -->
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px] border">
                  S/N
                </TableHead>
                <TableHead class=" text-left border">Name</TableHead>
                <TableHead class=" text-left border">Reg.No</TableHead>
                <TableHead v-for="(day, dayIndex) in days" :key="dayIndex" class="text-right border">{{ day }}</TableHead>
                <TableHead class=" text-right border">W/D</TableHead>
                <TableHead class=" text-right border">W/D</TableHead>
                <TableHead class=" text-right border">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(item, index) in filteredCustomers" :key="index">
                <TableCell class="font-left border">
                  {{ index + 1 }}
                </TableCell>
                <TableCell class="text-left border uppercase">
                    <router-link :to="`/customers/${item.id}`" class=" hover:underline hover:text-blue-500">
                        {{ item.name }}
                    </router-link>
                </TableCell>
                <TableCell class="font-left border">
                  {{ item.reg_number }}
                </TableCell>
  
                <!-- Loop through weekdays and align transactions -->
                <TableCell v-for="(day, dayIndex) in days" :key="dayIndex" class="text-right border">
                  {{ alignTransactionToDay(item.transactions)[dayIndex] || '-' }}
                </TableCell>
  
                <!-- withdrawal column -->
                <TableCell v-for="withdrawal in getWeeklyWithdrawals(item.transactions)" class="text-right border">
                  {{ withdrawal }}
                </TableCell>
                <!-- <TableCell class="text-right">
                  none
                </TableCell> -->
  
                <TableCell class="text-right border">
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
                </TableCell>
              </TableRow>
  
            </TableBody>
          </Table>
        </div>

        
    </div>
    <div class=" text-gray-400 text-center">copyright 2025 LedgerApp</div>
  </template>
  
  <script>
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  import { Button } from '@/components/ui/button'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog'
  
  import { Input } from '@/components/ui/input'
  import { MagnifyingGlassIcon } from '@radix-icons/vue'
  
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
  // import { Check, ChevronsUpDown } from 'lucide-vue-next'
  
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
  import { ExclamationTriangleIcon } from '@radix-icons/vue'
  
  
  
    export default {
      components: {
        Table,
        TableBody,
        TableCaption,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
        Button,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
        Input,
        MagnifyingGlassIcon,
        Command,
        CommandEmpty,
        CommandGroup,
        CommandInput,
        CommandItem,
        CommandList,
        Popover,
        PopoverContent,
        PopoverTrigger,
        Alert, AlertDescription, AlertTitle,
        ExclamationTriangleIcon,
      },
      data() {
        return {
            user: {
                name: '',
                company_name: ''
            },
            address: [
              "school road",
              "high-life",
              "Clifford",
              "adazi",
              "ngwa-road"
            ],
          deposit_modal: false,
          MagnifyingGlassIcon,
          cn,
          value: '',
          open: false,
  
          customers: [],
          amount: '',
  
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
  
          week: [],
  
          error: '',
  
          time_stat: {
            day: '',
            month: '',
          },
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          withdrawal_modal: false,
          searchQuery: "",
  
          selectedWeek: this.getWeekNumber(new Date()), // Default to current week
          all_customers: '',
          total_balance: '',
  
          new_customer_modal: false,
          registration_modal: false,

          edit_customer_modal: false,
          delete_customer_modal: false,
          new_amount: '',
          transaction_id: '',

          date_of_deposit: '',


  
        }
      },
      methods: {
       


        deleteCustomer(customerId) {
          // Retrieve existing customers from localStorage
          const customers = JSON.parse(localStorage.getItem("customers")) || [];

          // Find the customer index
          const customerIndex = customers.findIndex(customer => customer.id === customerId);

          if (customerIndex === -1) {
            console.error("Customer not found");
            return false; // Return false if the customer doesn't exist
          }

          // Remove the customer from the array
          customers.splice(customerIndex, 1);

          // Save updated customers back to localStorage
          localStorage.setItem("customers", JSON.stringify(customers));

          console.log(`Customer with ID ${customerId} deleted successfully.`);
          this.loadCustomers();
          return true; // Return true to indicate success
        },

        updateCustomer(customerId) {
          // const customerId = "1234567890"; // Replace with the actual customer ID
          const updatedInfo = this.customer;

          const success = this.editCustomer(customerId, updatedInfo);
          if (success) {
            console.log("Customer updated successfully!");
            this.loadCustomers(); // Refresh the customer list if needed
          } else {
            console.error("Failed to update customer");
          };

          this.edit_customer_modal = false;
        },

        editCustomer(customerId, updatedInfo) {
          // Retrieve existing customers from localStorage
          const customers = JSON.parse(localStorage.getItem("customers")) || [];
          
          // Find the customer by ID
          const customerIndex = customers.findIndex(customer => customer.id === customerId);
          
          if (customerIndex === -1) {
            console.error("Customer not found");
            return false; // Return false if the customer is not found
          }
          
          // Update the customer information
          customers[customerIndex] = {
            ...customers[customerIndex], // Preserve existing properties
            ...updatedInfo,             // Overwrite with updated properties
          };
          
          // Save updated customers back to localStorage
          localStorage.setItem("customers", JSON.stringify(customers));
          
          console.log("Customer updated:", customers[customerIndex]);
          return true; // Return true if the operation was successful
        },

        loadUSerData(){
            const user = JSON.parse(localStorage.getItem("finance_app_user")) || {name: '', company_name: ''};
            this.user = user;
            if(!user.name || !user.company_name){
                this.registration_modal = true;
            } else {
              this.registration_modal = false;
            }
        },

        setUserDetails(){
            const user = this.user;
            localStorage.setItem("finance_app_user", JSON.stringify(user));
            this.registration_modal = !this.registration_modal;
            window.location.reload();
        },

        printSheet(){
            const table = document.getElementById("table").outerHTML;
            const print_window = window.open("", "_blank");
            print_window.document.write(`
                <html>
                    <head>
                        <title>Ledger Record For Week ${this.selectedWeek}</title>
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
                        <h3>Ledger Record for week ${this.selectedWeek}</h3>
                        ${table}
                    </body>
                </html>
            `);
            print_window.document.close();
            print_window.focus();
            print_window.print();
            print_window.close();
        },

        getCurrentDayIndex() {
          // Get today's day index (Monday = 0, ..., Friday = 4)
          const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
          return this.days.indexOf(today);
        },
  
        getWeeklyWithdrawals(transactions = []) {
          const withdrawals = transactions
            .filter((transaction) => transaction.type === "withdrawal")
            .map((transaction) => transaction.amount);
  
          // Ensure exactly two columns (withdrawals or dashes)
          return [withdrawals[0] || "-", withdrawals[1] || "-"];
        },
  
        alignTransactionToDay(transactions = []) {
          const days = this.days; // Array of weekdays (e.g., ["Monday", "Tuesday", ...])
          const dayMap = new Map();
  
          // Map "deposit" transactions to their corresponding days
          transactions
            .filter((transaction) => transaction.type === "deposit") // Filter for "deposit" transactions only
            .forEach((transaction) => {
              const day = new Date(transaction.date).toLocaleDateString("en-US", {
                weekday: "long",
              });
              dayMap.set(day, transaction.amount);
            });
  
          // Return amounts or dashes for each weekday
          return days.map((day) => dayMap.get(day) || "-");
        },
  
        
        getCurrentDateTime() {
          const now = new Date();
  
          // Get current time in HH:mm:ss format
          const time = now.toLocaleTimeString("en-US", { hour12: false });
  
          // Get current day (e.g., Monday)
          const day = now.toLocaleDateString("en-US", { weekday: "long" });
  
          // Get current month (e.g., January)
          const month = now.toLocaleDateString("en-US", { month: "long" });
  
          this.time_stat.day = day;
          this.time_stat.month = month;
          // return { time, day, month };
        },
  
        loadCustomers() {
          this.customers = JSON.parse(localStorage.getItem("customers")) || [];
          this.getCurrentDateTime();
          this.getAllCustomersAndBalance();
          console.log("loaded customers: ", this.customers)
        },
  
        addNewCustomer() {
          const customers = JSON.parse(localStorage.getItem("customers")) || [];
          const trimmedName = this.customer.name?.trim();
  
          // Validation: Check if the name is provided
          if (!trimmedName) {
            this.error = "Please provide a customer name to continue";
            return null;
          }
  
          // Validation: Check for duplicate names (case-insensitive)
          const nameExists = customers.some(
            (customer) => customer.name.toLowerCase() === trimmedName.toLowerCase()
          );
  
          if (nameExists) {
            this.error = "Sorry, a customer with this name already exists";
            return null;
          }
  
          // Add new customer
          const newCustomer = {
            id: Date.now().toString(),
            name: trimmedName,
            reg_number: this.customer.reg_number,
            address: this.customer.address,
            phone: this.customer.phone,
            reg_date: this.customer.reg_date,
            balance: 0,
            transactions: [],
          };
  
          customers.push(newCustomer);
          localStorage.setItem("customers", JSON.stringify(customers));
          this.loadCustomers();

          // check for customer and create new ledger reg no
         /*  checkListLengthAndCallFunction(customers, (()=>{
            this.customer.reg_number = ``
          })); */
  
          console.log("New customer added:", newCustomer);
          this.error = null; // Clear any previous error messages
        },

        checkListLengthAndCallFunction(list, callback) {
            if (list.length % 20 === 0 && list.length > 0) {
                callback(); // Call the function when the condition is met
            }
        },
          
  
        getWeekNumber(date) {
          const currentDate = new Date(date);
          const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
          const pastDaysOfYear = (currentDate - startOfYear + (startOfYear.getTimezoneOffset() - currentDate.getTimezoneOffset()) * 60 * 1000) / 86400000;
          return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        },
        
  
        // deposit
        newDepositTransaction(customer_id, type) {
          const customers = JSON.parse(localStorage.getItem("customers")) || [];
          const customer = customers.find((c) => c.id === customer_id);
  
          if (!customer) throw new Error("Customer not found");
  
          // Get the current date in YYYY-MM-DD format
          const today = new Date().toISOString().split("T")[0];
  
           // Initialize transactions array if not already present
          customer.transactions = customer.transactions || [];

          // create new transaction...
          const transaction = {
            id: Date.now().toString(),
            type: "deposit",
            amount: this.amount,
            date: this.date_of_deposit,
            week: this.getWeekNumber(new Date()),
          };
  
          // Check if a transaction of the same type already exists for today
          const hasTransactionToday = customer.transactions.some(
            (t) => t.type === "deposit" && t.date === transaction.date
          );

  
          if (hasTransactionToday) {
            // throw new Error(`A ${type} transaction has already been made today.`);
            this.error = "Transaction has already been made today"
            return null
          }
  
          
  
          customer.balance += this.amount;
  
          customer.transactions.push(transaction);
          localStorage.setItem("customers", JSON.stringify(customers));
          console.log("Customer transacting: ", customer);
          console.log(`New transaction for: ${this.amount} - ${type}`);
  
          // reload users...
          this.loadCustomers();
  
          // close modal after 2s
          setTimeout(() => {
            this.deposit_modal = !this.deposit_modal
          }, 500);
        },
  
  
        // withdrawal
        newWDTransaction(customer_id) {
          const customers = JSON.parse(localStorage.getItem("customers")) || [];
          const customer = customers.find((c) => c.id === customer_id);
  
          if (!customer) throw new Error("Customer not found");
  
          if (customer.balance < this.amount) {
            // throw new Error("Insufficient balance");
            this.error = "Insufficient balance";
            return null
          }
  
          // Get the current date in YYYY-MM-DD format
          const today = new Date().toISOString().split("T")[0];
  
          // Check if a transaction of the same type already exists for today
          const hasTransactionToday = customer.transactions.some(
            (t) => t.type === "withdrawal" && t.date.split("T")[0] === today
          );
  
          if (hasTransactionToday) {
            // throw new Error(`A ${type} transaction has already been made today.`);
            this.error = "Transaction has already been made today"
            return null
          }
  
          const transaction = {
            id: Date.now().toString(),
            type: "withdrawal",
            amount: this.amount,
            date: new Date().toISOString(),
            week: this.getWeekNumber(new Date()),
          };
  
          // deduct from balance...
          customer.balance -= this.amount;
  
          customer.transactions.push(transaction);
          localStorage.setItem("customers", JSON.stringify(customers));
          console.log("Customer transacting: ", customer);
          console.log(`New transaction for: ${this.amount} - withdrawal`);
  
          // reload users...
          this.loadCustomers();
  
          // close modal after 2s
          setTimeout(() => {
            this.withdrawal_modal = !this.withdrawal_modal
          }, 500);
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
      },
  
      computed: {
      /*   filteredCustomers() {
          // Filter customers based on the search query
          const query = this.searchQuery.toLowerCase();
          return this.customers.filter((customer) => 
            customer.name.toLowerCase().includes(query)
          );
        },
   */
        // SEARCH AND FILTER FOR WEEK ALSO
        filteredCustomers() {
            return this.customers
            .map((customer) => {
                // Filter transactions for the selected week
                const weeklyTransactions = (customer.transactions || []).filter(
                (transaction) => transaction.week === this.selectedWeek
                );
                return { ...customer, transactions: weeklyTransactions };
            })
            .filter((customer) => {
                // Apply search query and ensure customers are included even if transactions are empty
                return customer.name
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase());
            });
        },
  
        availableWeeks() {
          // Get the current week
          const currentWeek = this.getWeekNumber(new Date());
          
          // Get all unique weeks from the transactions
          const weeks = new Set([currentWeek]); // Start with the current week
          this.customers.forEach((customer) => {
            customer.transactions.forEach((transaction) => {
              weeks.add(transaction.week);
            });
          });
  
          // Return sorted array of unique weeks
          return Array.from(weeks).sort((a, b) => a - b);
        },
  
       
  
      },
  
      created() {
        this.loadCustomers();
        this.loadUSerData();
        
      },
    }
  </script>
  
  <style>
  .stat_box{
    @apply flex flex-row gap-5 font-bold uppercase rounded-lg border p-5 flex-1 items-center
  }

  input{
    @apply border rounded-md p-3
  }
  </style>