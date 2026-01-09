import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-splash-scream',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './splash-scream.component.html',
  styleUrls: ['./splash-scream.component.scss']
})
export class SplashScreamComponent {
  constructor() { }
}