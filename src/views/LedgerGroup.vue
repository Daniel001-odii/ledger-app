<template>
    <div>
        <h1 class=" font-bold text-4xl">Ledger for Group <span class=" uppercase">{{ this.$route.params.group }}</span></h1>

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
                    {{ item.reg_date }}
                    </td>
                </tr>
    
                <!-- </TableBody> -->
            </table>
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

    export default {
        components: {
            Table,
        TableBody,
        TableCaption,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
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
    },

    mounted(){
        this.getCustomersByRegNumberGroup()
    }
}
</script>

<style scoped>

</style>s