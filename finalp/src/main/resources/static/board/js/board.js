$(document).ready(function() {	

   $('#1').click(function() {
    $('input[name=11][value=60]').prop('checked', true);
    updateGenderResult();
  });
  $('#2').click(function() {
    $('input[name=11][value=30]').prop('checked', true);
    updateGenderResult();
  });
  $('#3').click(function() {
    $('input[name=11][value=182]').prop('checked', true);
    updateGenderResult();
  });
   function updateGenderResult() {
    var selectedValue = $('input[name=11]:checked').val();
    console.log(selectedValue)
    
    const date1 = document.getElementById('date1');
const date2 = document.getElementById('date2');
//const time=1000*60*60*24*92;
        const datee = new Date();
        const date5= datee.getTime()-(1000*60*60*24*selectedValue);
        const date = new Date(date5);
        const yyyy = date.getFullYear();
        const mm = date.getMonth()+1 > 9 ? (date.getMonth()+1) : '0' + (date.getMonth()+1);
        const dd = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        const year = datee.getFullYear();
        const month = datee.getMonth()+1 > 9 ? (datee.getMonth()+1) : '0' + (datee.getMonth()+1);
        const day = datee.getDate() > 9 ? datee.getDate() : '0' + datee.getDate();
        
        date1.value=yyyy+ "-" + mm+ "-" + dd;
        date2.value=year+ "-" + month+ "-" + day;
  }
  
  });