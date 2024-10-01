<script>
import { useUserStore } from '@/stores/users';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; 
import moment from 'moment';

  export default{
    props: ['invoiceData'],
    setup(){
      const userStore = useUserStore();
      const store =  userStore.getStatus

      return { store, userStore }
    },
    data() {
  return {
    accountMessage: false,
    brandName: '',
    firstname: '',
    lastname: '',
    siret: '',
    phone: '',
    streetAddress: '',
    city: '',
    zip: '',
    webSite: '',
  }
},
    async mounted() {
  const userEmail = localStorage.getItem('userEmail');
 console.log(this.invoiceData)
  
},
    methods: {
            formatOrderDate(date) {
                return moment(date).format('DD-MM-YYYY');
            },
            async downloadInvoice() {
                const invoice = this.$refs.invoice;

                html2canvas(invoice, {scale: 5}).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('invoice.pdf');
            });
        }
    },
  }
</script>

<template>
  <div class="inv_container" ref="invoice">
    <div class="p2b_infos">
        <span class="bolder">LA CHAINE GRAPHIQUE DES 3 MÉTIERS</span>
        <span>9, chemin Mendhibista</span>
        <span>64200 ARCANGES</span>
    </div>
    <div class="invoice_title bolder">FACTURE</div>
    <div class="invoice_infos">
        <div class="invoice_order">
            <span class="bolder invoice_order-sub">Numéro : {{ invoiceData[0].invoiceNbre }}</span>
            <span class="bolder invoice_order-sub">Date : {{ formatOrderDate(invoiceData[0].orderDate) }}</span>
        </div>
        <div class="invoice_user">
            <span class="user_infos">{{invoiceData[1].brandName}}</span>
            <span class="user_infos">{{invoiceData[1].adress}}</span>
            <span class="user_infos">{{invoiceData[1].zip}}   {{invoiceData[1].city}}</span>
        </div>
    </div>
    <div class="invoice_sub">
        <span class="invoice_subtitle bolder" >Référence</span>
        <span class="invoice_subtitle bolder" >Désignation</span>
        <span class="invoice_subtitle bolder" >Montant HT</span>
    </div>
    <div class="invoice_detail">
        <span class="invoice_ref">{{ invoiceData[0].eventIdentifier }}</span>
        <span class="invoice_object">{{ invoiceData[0].invoiceObject }}</span>
        <span class="invoice_ht">{{ invoiceData[0].amountOrderWT }} </span>
    </div>
    <div class="invoice_amount">
        <div class="invoice_amount-box">
            <div class="amount_infos">
                <span class="infos_border">Total HT</span>
                <span class="amount">{{ invoiceData[0].amountOrderWT }} €</span>
            </div>
            <div class="amount_infos">
                <span class="infos_border">TVA (20,00%)</span>
                <span class="amount">{{ (invoiceData[0].amountOrderWT * 0.2).toFixed(2) }} €</span>
            </div>
            <div class="amount_infos">
                <span class="infos_border">Total TTC</span>
                <span  class="amount">{{( Number(invoiceData[0].amountOrderWT) + (invoiceData[0].amountOrderWT * 0.2)).toFixed(2) }} €</span>
            </div>
        </div>
    </div>
    <div class="invoice_footer">
        <span class="legal_infos">SAS au Capital de 500 000€ - Siren 823331848</span>
        <span class="legal_infos">N°TVA Intra FR 69 82331848 - N_ICS FR77ZZZ8281BD</span>
        <span class="legal_infos">9, Ch de Mendhibista 64200 Arcanges</span>
    </div>
  </div>
  <div class="donwload_btn">
    <img @click="downloadInvoice" src="@/assets/download.png" class="download_img"/>
  </div>
  
</template>

<style lang="css" scoped>

.inv_container{
  width: 595px;
  height: 842px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color:white;
  padding-inline: 1rem;
  overflow: scroll;
  margin-left: 5rem;
}
.p2b_infos{
    color: black;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-top: 2rem;
    font-size: 0.8rem;
}
.bolder{
    font-weight: bold;
   
}
.invoice_title{
    margin-block: 2rem;
    font-size:1rem;
    color: var(--primary);
    width: 100%;

}
.invoice_infos{
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.invoice_order{
    color: black;
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 3rem;
    padding-block: 0.5rem;
    font-size: 0.6rem;
}
.invoice_order-sub{
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    font-size: 0.6rem;
}
.invoice_user{ 
    width: 50%;
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid var(--primary);
    font-size: 1rem;
}
.user_infos{
    padding-left: 1rem;
    padding-block: 0.5rem;
    font-size: 0.6rem;
}
.invoice_sub{
    width: 100%;
    border: 1px solid var(--primary);
    display: grid;
    grid-template-columns: 25% 50% 25% ;
    margin-top: 2rem;;
    
}
.invoice_subtitle{
    color: black;
    border-right: 1px solid var(--primary);
    text-align: center;
    padding-block: 0.5rem;
    font-size: 0.8rem;
}
.invoice_detail{
    width: 100%;
    color: black;
    display: grid;
    grid-template-columns: 25% 50% 25% ;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    font-size: 0.6rem;
    
}
.invoice_ref, .invoice_object{
    margin-left: 1rem;
    border-right: 1px solid black;
    padding-top: 1rem;
    height: 250px;
}
.invoice_ht{
    justify-self: center;
    padding-top: 1rem;
    height: 250px;
}
.invoice_amount{
    width: 100%;
    display:flex;
    justify-content: flex-end;
    font-size: 0.6rem;
}
.invoice_amount-box{
    color: black;
    display: flex;
    flex-direction:column;
    width: 25%
}
.amount_infos{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
}
.infos_border{
    width: 50%;
    border-right: 1px solid black;
    padding-block: 0.5rem;
    margin-left: 0.3rem;
    font-size: 0.6rem;
}
.amount{
    margin-right: 0.3rem;
}
.invoice_footer{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content:center;
    text-align: center;
    color: black;
    margin-top: 130px;
    margin-bottom: 1rem;;
}
.legal_infos{
    padding-block: 0.3rem;
    font-size: 0.6rem;
}

.donwload_btn{
    width:2.5rem;
    height:2.5rem;
    border-radius: 50%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5rem;
    cursor: pointer;
}
.download_img{
    height:1.5rem;
}
@media screen and (max-width: 1000px) {
  .account_container{
    width: 90%;
    height: 65vh;
    padding-bottom: 3rem;
    background-color: var(--primary);
  }
}
</style>