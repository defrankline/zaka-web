import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from "../auth.service";
import {StateStorageService} from "../state-storage.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', {static: false})
  username?: ElementRef;
  fact: string;
  hide = true;
  facts: string[] = [
    'Over 100 million copies of the Bible are sold each year',
    'In 1631, a publishing company published a Bible with the typo "Thou Shalt Commit Adultery." Only 9 of these Bibles, known as the "Sinners\' Bible" exist today.',
    'The word "bible" is from the Greek ta biblia, which means "the scrolls" or "the books." The word is derived from the ancient city of Byblos, which was the official supplier of paper products to the ancient world.',
    'The full Bible has been translated into 532 languages. It has been partially translated into 2,883 languages.',
    'The Bible is not a single work but a collection of works from a wide variety of authors, such as shepherds, kings, farmers, priests, poets, scribes, and fisherman. Authors also include traitors, embezzlers, adulterers, murders, and auditors',
    'The King James Bible contains 788,258 words, 31,102 verses, 1,189 chapters, and 66 books.',
    'The shortest verse in the Bible is John 11:35, which states, "Jesus wept."',
    'The longest book in the Bible is Psalm 119.',
    'The shortest book in the Bible is Psalm 117, with just 2 verses.',
    'The longest verse in the Bible is Esther 8:9',
    'Nearly 8 in 10 Americans regard the bible as either the literal word of God or as inspired by God.',
    'Women are more likely than men, older people are more likely than younger people, and African Americans are more likely than other races to read the Bible.',
    'According to one author, God killed about 25 million people in the Bible. Satan kills about 60 people, 10 of whom God allowed Satan to kill as part of a bet in the Book of Job.',
    'The longest word in the Bible is "Mahershalalhashbaz (Isaiah 8:3).',
    'While it took over 1,000 years to write the Old Testament, the New Testament was written within a period of 50-75 years.',
    'No original writings of the Bible exits.',
    'The Bible informs the tradition of three major world religions: Christianity, Judaism, and Islam.',
    'The top 3 highlighted books of all time on Kindle are 1) The Holy Bible by Crossway Bibles, 2) Steve Jobs by Walter Isaacson, and 3) The Hunger Games',
    'John Wycliffe produced the first translation of the entire Bible from Latin Vulgate into English. However, after he died, the Catholic Church exhumed and burned his corpse as punishment for his translation work.',
    'William Tyndale produced first printed edited of the New Testament in English. He was later burned at the stake for his efforts.',
    'Adam\'s name is from the Hebrew word a da ma, which means "the ground."',
    'The first authorized Bible printed in English is the Great Bible of 1539. King Henry VIII of England declared that it should be read aloud during the church services in the Church of England',
    'China is not only the largest producer of textiles and manufactured goods in the world; the country is also the largest producer of Bibles.',
    'The Bible has inspired more song lyrics than any other book, including "40" (U2), "Adam Raised a Cain," (Bruce Springsteen), "Adam\'s Apple" (Aerosmith), "All you Zombies" (The Hooters), "Be Still" (Kelly Clarkson), "Blackened" (Metallica), "Cinnamon Girl" (Prince), "Come Sail Away (Styx), "Every Grain of Sand" (Bob Dylan), "I am God" (Kanye West) and many more.',
    'The Geneva Bible is the first Bible to use numbered verses. It is also the Bible Shakespeare used and the one that the Pilgrims brought to America in 1620.',
    'While there are no descriptions of Jesus in the Bible, the image of him with fair skin, light hair, and blue eyes is most likely incorrect and reflect the cultural influences of European Christians. Christ most likely had more Middle Eastern features.',
    'The Bible is the most commonly stolen book in the world, most likely because it is so available in hotel rooms and places of worship.',
    'Muslims believe that the Bible is revelation from God that has been corrupted by men. They believe that the Quran is its correction.',
    'Bob Marley was buried with a stalk of marijuana, his red Gibson Les Paul guitar, and a Bible.',
    'The King James Bible (1611) is said to be unrivaled in its accuracy and literary beauty. In addition to 54 scholars, Shakespeare mostly likely helped with the translation.',
    'Robert Aitken\'s Bible (The King James Version without the Apocrypha) was the first English Bible printed in America.',
    'The Bible takes place across three continents: Asia, Africa, and Europe.',
    'The pinnacle of Renaissance art is thought to be Michelangelo\'s "The Creation of Adam," a work that depicts in a single image the entire Biblical story of God\'s relationship to humanity.',
    'The Bible doesn\'t mention how many wise men visited Christ, only that they brought three types of gifts: gold, frankincense, and myrrh.',
    'As do many classics, Herman Melville\'s Moby Dick relies heavily on biblical allegory. Specifically, several characters are named after Biblical figures, such as Ishmael and Ahab.',
    'The Bible is the best-selling book in history, with total sales exceeding 5 billion copies.',
    'Charlton Heston was cast as Moses in the blockbuster movie The Ten Commandments partly because he resembled Michelangelo\'s famous statue of Moses. Heston would later play Michelangelo in the film The Agony and the Ecstasy',
    'The 1999 blockbuster The Matrix heavily draws from the Bible. The rebel base in the movie is known as Zion, the primary ship is named Nebuchadnezzar (after the Biblical king), and the film\'s Judas character is named Cypher in reference to the name LuCIPHER.',
    'Jesus was not an only child. He had at least 4 brothers mentioned by name and at least 2 unnamed sisters.',
    'The word "Christ" is from the Greek khristos, meaning "the anointed," which is the noun of the verbal adjective khriein, meaning, "to rub anoint."',
    'There are 93 women who speak in the Bible, 49 of whom are named. They speak a total of 14,056 words, or about 1.1% of the Bible. There are a total of 188 named women in the Bible.',
    'Polish-born author Joseph Conrad learned English by reading pages of a Bible before he tore them out and rolled them into cigarettes.',
    'The Gutenberg Bible was the was the first book to be printed using movable metal type.',
    'In 2011, author Brendan Powell Smith published The Brick Bible, which contains recreations of Bible scenes—all with LEGO bricks. Sam’s Club promptly banned the book for objectionable images.',
    'The most expensive book in the world is the translation of Biblical psalms, "The Bay Psalm Book" which was sold for over $14 million. It is the first book printed America and was the Puritan’s attempt to make their translation of the Old Testament book.',
    'The world’s smallest bible can fit on the tip of a pen. Scientists etched the 1.2 million letters of the Old Testament on a tiny silicone disk, which they call the Nano Bible."',
    'The world’s largest Bible weighs 1,094 pounds. Built by Louis Waynai in 1930, the book is 43.5 inches tall and a laid open width of 98 inches.',
    'The word "Lucifer" is from the Latin lux "light" + ferre "carry," or, literally, "light-bringing."',
    'The last word in the Bible is Amen.',
    'Nearly all of the villains in the Bible have red hair.',
  ];

  formError = false;
  isLoading = false;
  authenticationError = false;

  /**
   * Declare form
   */
  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private stateStorage: StateStorageService,
    private router: Router
  ) {
    const i = Math.floor(Math.random() * 50);
    const facts = this.facts;
    this.fact = facts[i];
  }

  ngOnInit(): void {
    document.getElementById('flash-page')?.remove();
  }

  ngAfterViewInit(): void {
    if (this.username) {
      this.username.nativeElement.focus();
    }
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * max);
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.formError = true;
      return;
    }
    this.isLoading = true;
    this.formError = false;
    this.authenticationError = false;
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe(
      () => {
        this.authenticationError = false;
        this.isLoading = false;
        if (!this.stateStorage.getUrl()) {
          this.router.navigate(['/app']);
        } else {
          this.router.navigate([this.stateStorage.getUrl()]);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.isLoading = false;
        if (error.status === 401) {
          this.authenticationError = true;
        }
      }
    );
  }
}
