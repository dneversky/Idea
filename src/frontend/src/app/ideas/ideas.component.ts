import { Component, OnInit } from '@angular/core';
import {Idea} from "../models/Idea";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.css']
})
export class IdeasComponent implements OnInit {

  public search: string;
  public status: string;

  public pageIndex: number = 0;
  public pageSize: number = 5;
  public pagers: number[] = [];
  public pagerSize: number = 0;

  public ideas: Idea[];
  public paginatedIdeas: Idea[];
  public filteredIdeas: Idea[];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ideas = this.activatedRoute.snapshot.data.ideas.filter((idea: Idea) => idea);

    this.filteredIdeas = this.ideas;
    this.goIndex(0);
  }

  initPagination(size: number) {

    this.pagerSize = size;

    this.pagers = [];
    this.pagers.push(0);

    if(this.pageSize * size - this.filteredIdeas.length == 0)
      size = size - 1;

    if(size > 7) {

      if(this.pageIndex < 4) {
        for(let i = 1; i < 6; i++)
          this.pagers.push(i);

      } else if (this.pageIndex >= 4) {
        this.pagers.push(this.pageIndex - 2);
        this.pagers.push(this.pageIndex - 1);

        if(this.pageIndex != size)
          this.pagers.push(this.pageIndex);

        if(this.pageIndex < size - 3) {
          this.pagers.push(this.pageIndex + 1);
          this.pagers.push(this.pageIndex + 2);
        } else if (this.pageIndex >= size - 3 && this.pageIndex < size - 1) {
          this.pagers.push(this.pageIndex + 1);
          if (this.pageIndex == size - 3)
            this.pagers.push(this.pageIndex + 2);
        }
      }
      this.pagers.push(size);
    } else {
      for (let i = 1; i <= size; i++)
        this.pagers.push(i);
    }
  }

  goIndex(index: number) {
    this.pageIndex = index;
    this.paginatedIdeas = [];

    if(this.filteredIdeas.length == 0) {
      this.filteredIdeas = [];
    } else if (this.filteredIdeas.length / this.pageSize) {
      for (let i = 0; i < this.pageSize; i++)
        this.paginatedIdeas.push(this.filteredIdeas[index * this.pageSize + i]);
    }

    for(let i = 0; i < Math.floor(this.filteredIdeas.length / this.pageSize); i++) {

    }
    this.initPagination(Math.floor(this.filteredIdeas.length / this.pageSize));
  }

  filter() {
    this.filteredIdeas = this.ideas;

    if (this.search) {
      if (this.search.includes('#'))
        this.filteredIdeas = this.filteredIdeas.filter((idea: Idea) => idea.id == this.search.slice(1));
      else
        this.filteredIdeas = this.filteredIdeas.filter((idea: Idea) => idea.title.toLowerCase().includes(this.search.toLowerCase()));
    }

    if (this.status)
      this.filteredIdeas = this.filteredIdeas.filter((idea: Idea) => idea.status == this.status);

    this.goIndex(0);
  }

  sort(value: number) {
    switch (value) {
      case 1:
        this.filteredIdeas = this.filteredIdeas.sort((a, b) => {
          if (a.title.toLowerCase() > b.title.toLowerCase())
            return 1
          else if (a.title.toLowerCase() < b.title.toLowerCase())
            return -1
          else return 0
        });
        break;
      case 2:
        this.filteredIdeas = this.filteredIdeas.sort((a, b) => {
          if (a.looks > b.looks)
            return 1
          else if (a.looks < b.looks)
            return -1
          else return 0
        });
        break;
      case 3:
        this.filteredIdeas = this.filteredIdeas.sort((a, b) => {
          if (a.rating > b.rating)
            return 1
          else if (a.rating < b.rating)
            return -1
          else return 0
        });
        break;
      case 4:
        break;
    }

    this.goIndex(0);
  }

  setPageSize(value: number) {
    this.pageSize = value;
    this.goIndex(0);
  }
}
