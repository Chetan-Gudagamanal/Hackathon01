
//Fetching Repository names of a User
let submit=document.getElementById("submit")
submit.addEventListener("click",(event)=>{
    if(document.querySelector(".repoList")){
        document.querySelector(".repoList").remove()
    }
    if(document.querySelector(".fileList")){
        document.querySelector(".fileList").remove()
    }
    document.getElementById("githubUser").innerText="Submit Valid UserName to view Repositories"
    let repoFunction = async()=>{
        try{
            let userName=document.getElementById("userName").value
    
            url=`https://api.github.com/users/${userName}/repos`
            let repos=fetch(url);
            let repoListRaw=await repos;
            let repoList=await repoListRaw.json();
            let repoNamesList=repoList.map(ele=>ele.name);
            

            //storing clone urls in "cloneUrls" object.
            let cloneUrls={};
            repoList.forEach(element => {
                cloneUrls[element["name"]]=element["clone_url"]
            });

            displayRepos(repoNamesList,userName,cloneUrls);
        }catch{
            alert("Please check GitHub username / If correct try after sometime")
            console.log("Something went wrong, Pls check the UserName")
        }
        
    }
    repoFunction();
    event.preventDefault();
    
})

//Displaying Repository names in WebPage
let displayRepos=(repoNamesList,userName,cloneUrls)=>{
    let githubUser=document.getElementById("githubUser")
    githubUser.innerText=userName;
    let divEle=document.querySelector(".repo")

    let ul=document.createElement("ul");
    ul.setAttribute("class","repoList col-6")
    divEle.append(ul);
    let para=document.createElement("p");
    para.setAttribute("class","text-center repo-list-head")
    if (repoNamesList.length===0){
        para.innerText="No Repositories found"
        ul.append(para);
    }
    else{
        para.innerText="All Repositories (click on any repo to view files inside)"
        ul.append(para);
        
        for (i of repoNamesList){
            let name=i;
            let li=document.createElement("li");
            let button=document.createElement("button")
            button.innerText=name
            button.setAttribute("class","btn button-info")
            button.setAttribute("id",name)
            button.addEventListener("click",(event)=>repositoryFiles(event,userName,name,cloneUrls))
            li.append(button)
            ul.append(li)
        }
    }
}



//Fetching Filenames in perticular Repository
let repositoryFiles=(event,userName,repo,cloneUrls)=>{
    let repoButtons=document.querySelectorAll(".button-info");
    repoButtons.forEach(element => {
        element.removeAttribute('name')
    });
    idSelector=`#${repo}`
    document.querySelector(idSelector).setAttribute('name', 'active');

    if(document.querySelector(".fileList")){
        document.querySelector(".fileList").remove()
    }
    
    let fileUrl=`https://api.github.com/repos/${userName}/${repo}/contents`
    let files=fetch(fileUrl)
    let filesFunction=async()=>{
        try{
            let filesInRepoRaw=await files;
            let filesInRepo=await filesInRepoRaw.json();
            let repoFilesList=filesInRepo.map(ele=>ele.name)
            displayFiles(repoFilesList,repo,cloneUrls)
        }catch{
            alert("Something went wrong, Pls try after sometime")
        }
    }
    filesFunction()
}

//Displaying Files inside a repository
let displayFiles=(repoFilesList,repo,cloneUrls)=>{
    let cloneUrl=cloneUrls[repo]

    let divEle=document.querySelector(".repo")
    let ol=document.createElement("ol");
    ol.setAttribute("class","fileList col-6")
    divEle.append(ol);

    let para=document.createElement("p");
    para.setAttribute("class","text-center file-list-head")
    if (repoFilesList.length===0){
        para.innerText="No Files found in this Repo"
        ol.append(para);
    }
    else{
        para.innerText=`Files inside Selected Repo (${repo})`
        ol.append(para);

        let inputGroup=document.createElement("div");
        inputGroup.setAttribute("class","input-group");
        ol.append(inputGroup)

        let inputType=document.createElement("input")
        inputType.setAttribute("type","text");
        inputType.setAttribute("class","cloneInput");
        inputType.setAttribute("id","clone");
        inputType.setAttribute("disabled","true");
        inputType.value=cloneUrl;
        inputGroup.append(inputType)

        let addOnBtn=document.createElement("button");
        addOnBtn.setAttribute("class","btn btn-outline-secondary")
        addOnBtn.innerText="Clone URL";
        inputGroup.append(addOnBtn)
        addOnBtn.addEventListener("click",()=>{
            navigator.clipboard.writeText(cloneUrl).then(function() {
                let x=setInterval(() => {
                    addOnBtn.innerText="--copied--";
                }, 1000)
                setTimeout(()=>{
                    clearInterval(x);
                    addOnBtn.innerText="Clone URL";
                },2000)
              }, function() {
                alert("Could-not copy, Something went wrong")
              });
        })
        

        let linkItem=document.createElement("li");
        let anchor=document.createElement("a");
        anchor.setAttribute("target","_blank")
        anchor.setAttribute("href",cloneUrl);
        anchor.setAttribute("id","anchor");
        anchor.innerText="CLICK HERE to view GitHub repository"
        linkItem.append(anchor)
        ol.append(linkItem);
        for (i of repoFilesList){
            let name=i;
            let li=document.createElement("li");
            let button=document.createElement("button")
            button.innerText=name
            button.setAttribute("class","btn btn-warning")
            button.setAttribute("id",name)
            li.append(button)
            ol.append(li)
        }
    }
}




