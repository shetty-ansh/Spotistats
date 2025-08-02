import { Component } from '@angular/core';

@Component({
  selector: 'app-testing',
  standalone: false,
  templateUrl: './testing.html',
  styleUrl: './testing.css'
})
export class Testing {
isToggled = false;
dummyTracks: any[] = [
  {
    name: "Track 1",
    artists: [{ name: "Artist A" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 2",
    artists: [{ name: "Artist B" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 3",
    artists: [{ name: "Artist C" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 4",
    artists: [{ name: "Artist D" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 5",
    artists: [{ name: "Artist E" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 6",
    artists: [{ name: "Artist F" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 7",
    artists: [{ name: "Artist G" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 8",
    artists: [{ name: "Artist H" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 9",
    artists: [{ name: "Artist I" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  },
  {
    name: "Track 10",
    artists: [{ name: "Artist J" }],
    album: { images: [{ url: "https://via.placeholder.com/150/90ee90" }] }
  }
];

toggleSwitch() {
  this.isToggled = !this.isToggled;
}

}
