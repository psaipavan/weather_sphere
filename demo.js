let todolistArray=[
   {task:"meeting with jagan at 10pm"},
   {task:"meeting with modi at 11 pm"},
   {task:"meeting kajol at 3 pm"},
]

function display(){
    let todolists="";
    for (let obj of todolistArray)
    {
        todolists+="<div>"+obj.task+"</div>"
    }

    let listIdElem=document.getElementById("listId");
    listIdElem.innerHTML=todolists;
}
display();