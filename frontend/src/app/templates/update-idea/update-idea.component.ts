import {Component, OnInit} from '@angular/core';
import {ImagesLoader} from "../../custom/ImagesLoader";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IdeaService} from "../../services/idea.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Idea} from "../../models/Idea";
import {environment} from "../../../environments/environment";
import {FilesLoader} from "../../custom/FilesLoader";
import {DialogComponent} from "../../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Tag} from "../../models/Tag";
import {User} from "../../models/User";
import {SnackbarService} from "../../shared/snackbar/snackbar.service";
import {CurrentUserService} from "../../services/current-user.service";

@Component({
  selector: 'app-update-idea',
  templateUrl: './update-idea.component.html',
  styleUrls: ['./update-idea.component.css']
})
export class UpdateIdeaComponent implements OnInit {

  public uploadPath = environment.uploadPath + "images/";

  public idea: Idea;
  public currentUser: User;

  public imagesLoader = new ImagesLoader();
  public filesLoader = new FilesLoader();

  public tags: Tag[];

  public mainForm: FormGroup;

  public preloader: boolean = false;

  constructor(private ideaService: IdeaService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _dialog: MatDialog,
              private snackBar: SnackbarService) { }

  ngOnInit() {
    this.idea = this.activatedRoute.snapshot.data.idea;
    this.tags = this.activatedRoute.snapshot.data.tags;
    this.currentUser = this.activatedRoute.snapshot.data.currentUser;

    this.mainForm = new FormGroup({
      title: new FormControl(this.idea.title, [Validators.minLength(8), Validators.maxLength(256), Validators.required]),
      text: new FormControl(this.idea.body, [Validators.minLength(256), Validators.maxLength(32768), Validators.required]),
    });
  }

  update() {
    if(this.mainForm.invalid)
      return

    const formData = new FormData();

    this.idea.removeImages = [];
    this.idea.removeFiles = [];

    this.idea.title = this.mainForm.get('title').value;
    this.idea.body = this.mainForm.get('text').value;
    this.imagesLoader.removeImagesList.forEach(x => this.idea.removeImages.push(x));
    for (let i = 0; i < this.imagesLoader.dataTransfer.files.length; i++)
      formData.append('addImages', this.imagesLoader.dataTransfer.files[i]);
    this.filesLoader.removeFilesList.forEach(x => this.idea.removeFiles.push(x));
    for (let i = 0; i < this.filesLoader.dataTransfer.files.length; i++)
      formData.append('addFiles', this.filesLoader.dataTransfer.files[i])

    formData.append('idea', JSON.stringify(this.idea));

    this.preloader = true;

    this.ideaService.putIdea(this.idea.id, formData).subscribe(() => {
      this.preloader = false;
      this.router.navigate(['ideas']);
      this.snackBar.success("Идея успешно отредактирована!");
    }, error => {
      console.log(error);
      this.snackBar.error();
      this.preloader = false;
    });
  }

  delete() {
    this._dialog.open(DialogComponent, {
      data: {
        title: "Предупреждение",
        message: "Восстановить идею будет невозможно. Вы уверены что хотите её удалить?"
      }
    }).afterClosed().subscribe(result => {
      if(result) {
        this.ideaService.deleteIdea(this.idea.id).subscribe(() => {
          this.router.navigate(['ideas']);
          this.snackBar.success("Идея успешно удалена!");
          CurrentUserService.currentUser.ideas = CurrentUserService.currentUser.ideas.filter(i => i.id != this.idea.id);
        }, error => {
          console.log(error);
          this.snackBar.error();
        });
      }
    });
  }

  setTags(tags: any) {
    this.tags = tags;
  }
}
