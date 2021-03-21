import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RomLoaderComponent } from './components/rom-loader/rom-loader.component';
import { RomLoaderService } from './services/rom-loader.service';

@NgModule({
    declarations: [
        RomLoaderComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        RomLoaderComponent,
    ],
})
export class RomLoaderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RomLoaderModule,
            providers: [
                RomLoaderService,
            ],
        };
    }
}
