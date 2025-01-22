<template>
    <div>
      <h2 class="text-2xl font-bold mb-4">All Daily Balances</h2>
      <table class="table-auto w-[400px] border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="border border-gray-300 px-4 py-2">Date</th>
            <th class="border border-gray-300 px-4 py-2 text-right">Balance (₦)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(balance, date) in dailyBalances" :key="date" class="hover:bg-gray-100">
            <td class="border border-gray-300 px-4 py-2 text-left">{{ date }}</td>
            <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(balance) }}</td>
          </tr>
        </tbody>
        <tfoot>
            <tr class="bg-gray-300 font-bold">
                <td class="border px-4 py-2 text-left">Total</td>
                <td class="border px-4 py-2 text-right">{{ formatCurrency(totalBalance) }}</td>
            </tr>
        </tfoot>
      </table>
      
    </div>
  </template>
  
  <script>
  export default {
    name: "DailyBalances",
    props: ["dailyBalances"],
    methods: {
      formatCurrency(amount) {
        return new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(amount);
      },
    },

    computed: {
        totalBalance() {
            return Object.values(this.dailyBalances).reduce((sum, val) => sum + val, 0);
        },
    },

  };
  </script>
  
  <style>
  table {
    border-spacing: 0;
    width: 100%;
  }
  th, td {
    text-align: left;
  }
  </style>
  