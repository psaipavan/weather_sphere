// let arr=["sai","pavan","pulluri"]

// let rv=arr.forEach(function(val,ind,arr){
//     console.log(arr);
// });


//filter method

// let arr=[10,20,3,40]
// let rv=arr.filter(function(val){
//     if(val%2==0){
//         return val;
//     }
// });
// console.log(rv);

//reduce method 

// arr=[1,2,3,4,5]
// let rv=arr.reduce(function(sum,val)
// {
//     sum+=val;
//     return sum;
// },0)
// console.log(rv);

//task for the adding bonus for the persons

// let empData=[
//     {name:"saipavan",salary:10000,email:"saipavanpulluri07@gmail.com"},
//     {name:"raju",salary:1090,email:"saipavanpulluri07@gmail.com"},
//     {name:"rani",salary:1080,email:"saipavanpulluri07@gmail.com"},
//     {name:"battudu",salary:90000,email:"saipavanpulluri07@gmail.com"},
//     {name:"para",salary:23030,email:"saipavanpulluri07@gmail.com"},

// ];

// let rv=empData.map(function(val,ind,arr){
//     val.salary+=1000;
//     return val;
// });

// console.log(rv);


let empData=[
    {name:"saipavan",salary:10000,email:"saipavanpulluri07@gmail.com"},
    {name:"raju",salary:1090,email:"saipavanpulluri07@gmail.com"},
    {name:"rani",salary:1080,email:"saipavanpulluri07@gmail.com"},
    {name:"battudu",salary:90000,email:"saipavanpulluri07@gmail.com"},
    {name:"para",salary:23030,email:"saipavanpulluri07@gmail.com"},

];
//1st method 
// let rv=empData.filter(function(val){
//     if(val.name=="para")
//     {
//         return val;
//     }
// });
// console.log(rv);

//2nd method 
// let rv=empData.find(function(val){
//     if(val.name=="para")
//     {
//         return true;
//     }
// });
// console.log(rv);


// sum of salaries 

let rv=empData.reduce(function(sum,empobj){
    sum+=empobj.salary;
    return sum;
},0);

console.log(rv);
