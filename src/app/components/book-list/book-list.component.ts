import { Component, OnInit } from '@angular/core';
import {Book} from '../../models/book';
import {BookService} from '../../services/book.service';
import {Params, ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AppConst} from '../../constants/app-const';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  public filterQuery = '';
  public rowsOnPage = 5;
  public sortBy: string;
  public sortOrder = 'asc';
  public selectedBook: Book;
  public bookList: Book[];
  public serverPath= AppConst.serverPath;
  public dateFetched = false;
  public showHideText = false;

  constructor(
    private bookService: BookService,
    private router: Router,
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['bookList']) {
        console.log('filtered book list');
        this.bookList = JSON.parse(params['bookList']);
        this.dateFetched = true;
      }else {
        this.bookService.getBookList().subscribe(
          res => {
            this.bookList = res;
            this.dateFetched = true;
            console.log(this.bookList);
          },
          error => {
            this.dateFetched = false;
            console.log(error);
          }
        );
      }
    });
  }

  onSelect(book: Book) {
    this.selectedBook = book;
    this.router.navigate(['/bookList', this.selectedBook.id]);
  }

  cutBookDescription(book: Book): string {
    if (book.description.length > 700) {
      return book.description.slice(0, 700) + '...';
    } else {
      return book.description;
    }
  }

}
