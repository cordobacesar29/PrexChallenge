import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MoviesApiService {

  private options = {
    method: 'GET',
    url: environment.apiURL,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-RapidAPI-Key': environment.apiKey,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-RapidAPI-Host': environment.apiHost
    }
  };

  constructor(public db: AngularFirestore) { }
  // add doc to firebase
  addDocument(data: any, path: string, id: string){
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }
  // get doc from firebase
  getDocument(path: string, id: string){
    const collection = this.db.collection(path);
    return collection.doc(id).valueChanges();
  }
  // delete doc from firebase
  deleteDocument(path: string, id: string){
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }
  // update doc in firebase
  updateDocument(path: string, id: string, data: any){
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }
  // get all docs from firebase
  // eslint-disable-next-line @typescript-eslint/naming-convention
  getCollection<tipo>(path: string){
    const collection = this.db.collection<tipo>(path);
    return collection.valueChanges();
  }
}
