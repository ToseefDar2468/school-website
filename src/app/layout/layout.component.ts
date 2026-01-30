import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { WhatsappFloatComponent } from '../components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsappFloatComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {}
