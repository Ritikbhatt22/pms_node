var connection = require("../config/config");





    // function timeConvert(n) {
    //     var num = n;
    //     var hours = (num / 60);
    //     var rhours = Math.floor(hours);
    //     var minutes = (hours - rhours) * 60;
    //     var rminutes = Math.round(minutes);
    //     return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
    //     }
        
    //     console.log(timeConvert(200));

    // exports.attendanceUser = (minutes1,minutes2) => {
    //     var date = new Date();
    
    //                     var minutes1 = (result[0].in_time.getHours() * 60) + result[0].in_time.getMinutes();
    //                     console.log(minutes1 + " Minutes");
    //                     var minutes2 = (out_time.out_time.getHours() * 60) + out_time.out_time.getMinutes();
    //                     console.log(minutes2 + " Minutes");
    
    
    //                     var num = minutes2 - minutes1;
    //                     var hours = (num / 60);
    //                     var rhours = Math.floor(hours);
    //                     var minutes = (hours - rhours) * 60;
    //                     var rminutes = Math.round(minutes);
    //                     var total_in_time = rhours + ":" + rminutes + ":" + 00;
    
    // }



//     exports.date= (date)=>{
//         let datee = new Date(date);

//          return  datee.getFullYear()+':'+(parseInt(datee.getMonth())+1)+':'+(parseInt(datee.getDay())+1)
//     }
    exports.date= (date)=>{
        let datee = new Date(date);

         return  datee.getFullYear()+'-'+(parseInt(datee.getMonth())+1)+'-'+(parseInt(datee.getDate()))
    }
    exports.time= (time)=>{
        let datee = new Date(time);

         return  datee.getHours()+':'+datee.getMinutes()+':'+datee.getSeconds()
    }

    exports.date1 =(date)=>{

        let datee = new Date(date);

        return  parseInt(datee.getDate())
    }