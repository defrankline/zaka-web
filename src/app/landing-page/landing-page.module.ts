import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingPageComponent} from './landing-page.component';
import {LandingPageRoutingModule} from './landing-page-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ContactComponent} from './contact/contact.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {IntroTwoComponent} from './intro-two/intro-two.component';
import {CtaComponent} from './cta/cta.component';
import {TestimonialsComponent} from './testimonials/testimonials.component';
import {WINDOW_PROVIDERS} from './helpers/window.helper';
import {SharedDirectivesModule} from './directives/shared-directives.module';
import { ModuleCarouselComponent } from './module-carousel/module-carousel.component';


@NgModule({
    declarations: [LandingPageComponent, ContactComponent,
        FooterComponent, HeaderComponent,
        CtaComponent, TestimonialsComponent,
        IntroTwoComponent,
        ModuleCarouselComponent
    ],
    imports: [
        CommonModule,
        LandingPageRoutingModule,
        SharedModule,
        SharedDirectivesModule
    ],
    exports: [
        HeaderComponent
    ],
    providers: [
        WINDOW_PROVIDERS
    ]
})
export class LandingPageModule {
}
