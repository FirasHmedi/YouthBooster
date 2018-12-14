
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";


@Injectable()
export class ProjectProvider {


constructor(private fdb: AngularFireDatabase){


}
users : any[]=[];
projects=[];
filtercateg='none';
bookmarks=[];
likeState= [];
projectID: string ="";
currentUser  ='DbuWTni47ZAkllESplv';
currentpictureUrl="https://firebasestorage.googleapis.com/v0/b/youth-booster.appspot.com/o/profiles%2Findex.png?alt=media&token=4ef3ca76-28fe-42f5-b9a5-e10266470f34";
currentfullName=" ";
  // jack balvin
// load method first method to be called


load(){

  this.fdb.list("/users").valueChanges().subscribe((data) => {
  data.forEach((each)=>{
    this.users[each['userId']]=each;
  });

  console.log(this.users);
  if(this.users[this.currentUser]){
   this.currentpictureUrl=this.users[this.currentUser]['pictureUrl'];
   this.currentfullName=this.users[this.currentUser]['fullname'];
   }
  },(err)=>{ console.log("probleme user : ", err); });


  if(!this.likeState)
  for(let i=0;i<10;i++)  // for icon like statue
     this.likeState.push('unliked');

this.fdb.list("/projects").valueChanges().subscribe((data) => {

     this.projects = data;
     this.projects.forEach((element)=>{
     if(JSON.stringify(element['author'])==JSON.stringify(this.currentUser)){
       this.projectID=element['projectId'];
     }
   });
     console.log(this.projectID);
  if(this.filtercateg!='none'){     // filter the  project after the update
   this.sortByKey(this.projects,this.filtercateg);
  }
       for(let i=this.likeState.length;i<data.length;i++)   // for icon like statue
          this.likeState.push('unliked');

},(err)=>{ console.log("probleme : ", err); });


               /*  tchargi men bookmarks datapage */
this.fdb.list("/bookmarks/"+this.currentUser+"/projects").valueChanges().subscribe((data) => {

this.bookmarks=data;

    if(this.bookmarks)
  this.bookmarks.forEach((data) => {
  this.likeState[data]='liked';
});
},(err)=>{ console.log("probleme bookmark : ", err); });

}




// open another page of project form
addProject(){

}

//like project and add it in likes section
likeProject(project)
{    console.log(this.bookmarks);


if(!this.bookmarks){
 let newLikes=project.likes+1;
  this.likeState[project['projectId']] ='liked';

   this.fdb.list("/projects").update(project.projectId,{  likes : newLikes  });

   this.fdb.list("/bookmarks/"+this.currentUser+"/projects").set(project.projectId,project.projectId);
console.log(" nothing is here")
console.log("it's added");

  }

else{

 let newLikes=project.likes+1;

  let bool=this.bookmarks.some((element)=>{
    console.log(JSON.stringify(element)==JSON.stringify(project.projectId));
    console.log(JSON.stringify(element)+"  "+JSON.stringify(project.projectId));
  return JSON.stringify(element)===JSON.stringify(project.projectId);  // wait
    });



if(!bool)
{
   console.log("bool is here")
  this.likeState[project.projectId] ='liked';

   this.fdb.list("/projects").update(project.projectId,{  likes : newLikes  });

   this.fdb.list("/bookmarks/"+this.currentUser+"/projects").set(project.projectId,project.projectId);

console.log("it's added");
}

else {

  this.likeState[project.projectId] = 'unliked';
  let newLikes=project.likes-1;

   this.fdb.list("/projects").update(project.projectId,{ likes : newLikes });

   this.fdb.list("/bookmarks/"+this.currentUser+"/projects").remove(project.projectId);

 console.log("it's removed");

}
}
}


   // sort by key method ( time or likes or views )
             sortByKey(array, key) {
            return array.sort(function (a, b) {
             var x,y;
             var parts1,parts2;

                if((key=='likes')||(key=='views'))
                {
                 x = a[key];
                 y = b[key];
                }
                else if((key=='newest')||(key=='oldest'))
                {

                  parts1=a['time'].split("/");
                  parts2=b['time'].split("/");
                  x = new Date(parts1[2], parts1[1] - 1, parts1[0]);
                  y = new Date(parts2[2], parts2[1] - 1, parts2[0]);

                }
                if(key=='oldest')
                return ((x < y) ? -1 : ((x > y) ? 0 : 1));
                else
                return ((x > y) ? -1 : ((x < y) ? 0 : 1));
           });

       }



}