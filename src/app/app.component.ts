import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PromptUpdateService } from './prompt-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version = environment.version;

  constructor(private promptUpdateService: PromptUpdateService) {
    this.promptUpdateService.check();
  }
}
