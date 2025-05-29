import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SocketService } from '../../services/socket-service.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(
    private socketService: SocketService,
    @Inject(PLATFORM_ID) private platformId: Object, 
     private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.socketService.listenToCustomEvent('taskUpdated').subscribe({
          next: (data) => {
            console.log('📥 taskUpdated recibido en HomePage:', data);
          },
          error: (err) => {
            console.error('⚠️ Error al escuchar evento:', err);
          }
        });
      });
    }
  }
}