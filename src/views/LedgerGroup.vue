<template>
<div>
    <Button @click="$router.back()">
        <i class=" bi bi-arrow-left"></i> Back
    </Button>

    <div class="" id="table">
        <div class=" flex flex-row items-center justify-between  mt-12">
            <h1 class=" font-bold text-4xl">Ledger for Group <span class=" uppercase">{{ this.$route.params.group }}</span></h1>
            <Button variant="outline" @click="printSheet()"> <i class="bi bi-printer"></i> Print Sheet</Button>
        </div>

        <div class=" flex mt-12">
            <table class=" border border-t mt-3" ref="printable_table" style=" margin-top: 5px;">
                <!-- <TableCaption>A list of customers and transactions.</TableCaption> -->
                <!-- <ther> -->
                    <tr>
                        <th class="w-[10px] border">
                        S/N
                        </th>
                        <th class=" text-left border">Name</th>
                        <th class=" text-right border">Reg.No</th>
                        <th class=" text-right border">Address</th>
                        <th class=" text-right border">Phone</th>
                        <th class=" text-right border">Registration Date</th>
                    </tr>
                <!-- </ther> -->
                <!-- <TableBody> -->
                <tr v-for="(item, index) in customers" :key="index" class=" cursor-pointer">
                    <td class="font-left border">
                    {{ index + 1 }}
                    </td>

                    <td class="text-left border">
                    {{  item.name }}
                    </td>

                    <td class="text-left border">
                    {{  item.reg_number }}
                    </td>
    
                    <td class="text-right border">
                    {{ item.address }}
                    </td>

                    <td class="text-right border">
                    {{ item.phone }}
                    </td>

                    <td class="text-right border">
                    {{ item.reg_date || item.date }}
                    </td>
                </tr>
    
                <!-- </TableBody> -->
            </table>
        </div>
        <!-- <customer-table v-if="customers" :customers="customers" /> -->
         <!-- {{ customers }} -->
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
import Button from '@/components/ui/button/Button.vue';
import CustomerTable from '@/components/CustomerTable';

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
        CustomerTable,
        },
        data(){
            return{
                customers: ''
            }
        },
        methods: {
            getCustomersByRegNumberGroup() {
                const group = this.$route.params.group;
                const customers = JSON.parse(localStorage.getItem("customers")) || [];

                // Filter customers whose reg_number starts with the given group
                this.customers = customers.filter((customer) => 
                    customer.reg_number && customer.reg_number.startsWith(group)
                );
            },

        printSheet(){
            const table = document.getElementById("table").outerHTML;
            const print_window = window.open("", "_blank");
            print_window.document.write(`
                <html>
                    <head>
                        <title> Ledger Sheet for group ${this.group}</title>
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
                        <h3>Ledger Sheet for group ${this.group}</h3>
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
        this.getCustomersByRegNumberGroup()
    }
}
</script>

<style scoped>

</style>s