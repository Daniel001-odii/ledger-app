<template>
    <Button @click="$router.back()">
        <i class=" bi bi-arrow-left"></i> Back
    </Button>
    <div>
        <!-- <h1>All Record for {{ customer.name }} here</h1>  -->

        <div class=" flex flex-row flex-wrap justify-between items-center border rounded-md p-5  mt-3">
            <span class=" font-bold text-4xl">{{ customer.name }}</span>
            <Button variant="outline" @click="printSheet()"> <i class="bi bi-printer"></i> Print Sheet</Button>
        </div>
        
        <!-- {{ transactions }} <br/> -->

        <div class=" flex flex-col gap-3 mt-12" id="table">
            <!-- {{ summary }} -->
            
            <div class=" flex flex-col" 
            style=" display: flex;
            gap: 3px;
            flex-direction: column;"
            >
                <span>{{ summary.depositTimes }} Total Deposits = NGN {{ summary.totalDeposits?.toLocaleString() }} </span>
                <span>{{ summary.withdrawTimes }} Total Withdrawals = NGN {{ summary.totalWithdrawals?.toLocaleString() }} </span>
                <span>Current Balance = NGN {{ customer.balance?.toLocaleString() }}</span>
            </div>
         

            <Table class=" border border-t mt-3" ref="printable_table" style=" margin-top: 5px;">
                <!-- <TableCaption>A list of customers and transactions.</TableCaption> -->
                <TableHeader>
                <TableRow>
                    <TableHead class="w-[10px] border">
                    S/N
                    </TableHead>
                    <TableHead class=" text-left border">Transaction type</TableHead>
                    <TableHead class=" text-right border">Amount (NGN)</TableHead>
                    <TableHead class=" text-right border">Date-Time</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow v-for="(item, index) in transactions" :key="index">
                    <TableCell class="font-left border">
                    {{ index + 1 }}
                    </TableCell>

                    <TableCell class="text-left border">
                    {{  item.type }}
                    </TableCell>
    
                    <TableCell class="text-right border">
                    {{ item.amount.toLocaleString() }}
                    </TableCell>

                    <TableCell class="text-right border">
                    {{ convertToReadableDateTime(item.date) }}
                    </TableCell>
                </TableRow>
    
                </TableBody>
            </Table>
            <!-- <div class=" hover:bg-gray-100 p-3 border-b flex flex-row justify-between" v-for="(transaction, index) in transactions" :key="index">
                <span>{{ index + 1}}. {{ transaction.type }} </span>
                <span>NGN {{ transaction?.amount?.toLocaleString() }}</span>
                <span> {{ transaction.date }}</span>
            </div> -->
        </div>
       
       
    </div>
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
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'

  import { Button } from '@/components/ui/button'

    export default {
        name: "CustomerRecord",
        components: {
            Table,
            TableBody,
            TableCaption,
            TableCell,
            TableHead,
            TableHeader,
            TableRow,
            DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
        Button,
        },
        data() {
            return {
                customer_id: this.$route.params.customer_id,
                transactions: '',
                customer: {
                    id: '',
                    name: '',
                    balance: '',

                },
                summary: {

                },
                
                deposit_modal: false,
                value: '',
                open: false,
        
                week: [],
        
                error: '',
        
                time_stat: {
                    day: '',
                    month: '',
                },
                days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                selectedWeek: this.getWeekNumber(new Date()), // Default to current week
            }
        },
        methods: {
            printSheet(){
            const table = document.getElementById("table").outerHTML;
            const print_window = window.open("", "_blank");
            print_window.document.write(`
                <html>
                    <head>
                        <title>${this.customer.name} Ledger Account Statement</title>
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
                        <h3>${this.customer.name} Account Statement</h3>
                        ${table}
                    </body>
                </html>
            `);
            print_window.document.close();
            print_window.focus();
            print_window.print();
            print_window.close();
        },

            convertToReadableDateTime(isoDate) {
                const date = new Date(isoDate);

                const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                };

                return date.toLocaleString("en-US", options);
            },

            getWeeklyWithdrawals(transactions = []) {
                const withdrawals = transactions
                    .filter((transaction) => transaction.type === "withdrawal")
                    .map((transaction) => transaction.amount);
        
                // Ensure exactly two columns (withdrawals or dashes)
                return [withdrawals[0] || "-", withdrawals[1] || "-"];
            },
  

            getCustomerRecordsByWeek(customerId) {
                const customers = JSON.parse(localStorage.getItem("customers")) || [];
                const customer = customers.find((c) => c.id === customerId);

                if (!customer) {
                    console.error("Customer not found");
                    return null; // Return null or an empty object if the customer is not found
                }

                const transactions = customer.transactions || [];

                let week;
                // Group transactions by week
                const recordsByWeek = transactions.reduce((result, transaction) => {
                    week = this.getWeekNumber(new Date(transaction.date));
                    if (!result[week]) {
                    result[week] = [];
                    }
                    result[week].push(transaction);
                    return result;
                }, {});

                // Return customer info along with weekly grouped transactions
                this.customer =  {
                    id: customer.id,
                    name: customer.name,
                    balance: customer.balance
                    };
                    // this.transactions = recordsByWeek[week];
                    this.transactions = customer.transactions;
                console.log("transactions: ", recordsByWeek);
            },

            getCustomerTransactionSummary(customerId) {
                const customers = JSON.parse(localStorage.getItem("customers")) || [];
                const customer = customers.find((c) => c.id === customerId);

                if (!customer) {
                console.error("Customer not found");
                return null; // Return null if customer doesn't exist
                }

                const transactions = customer.transactions || [];

                // Calculate totals and counts for deposits and withdrawals
                const summary = transactions.reduce(
                (acc, transaction) => {
                    if (transaction.type === "deposit") {
                    acc.totalDeposits += transaction.amount;
                    acc.depositTimes += 1;
                    } else if (transaction.type === "withdrawal") {
                    acc.totalWithdrawals += transaction.amount;
                    acc.withdrawTimes += 1;
                    }
                    return acc;
                },
                {
                    totalDeposits: 0,
                    depositTimes: 0,
                    totalWithdrawals: 0,
                    withdrawTimes: 0,
                }
                );

               /*  return {
                customerInfo: {
                    id: customer.id,
                    name: customer.name,
                    balance: customer.balance,
                },
                summary,
                }; */
                this.summary = summary;
            },


                // Helper Method: Get Week Number for a Date
            getWeekNumber(date) {
                const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                const pastDaysOfYear =
                    (date - firstDayOfYear + (firstDayOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000) /
                    86400000;
                return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            },

        },

        mounted() {
            this.getCustomerRecordsByWeek(this.customer_id);
            this.getCustomerTransactionSummary(this.customer_id);
        },
    }
</script>

<style scoped>

</style>