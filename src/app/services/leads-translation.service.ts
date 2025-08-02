import { Injectable } from '@angular/core';
import { GlobalTranslationService } from './global-translation.service';

@Injectable({
  providedIn: 'root'
})
export class LeadsTranslationService {
  constructor(private globalTranslationService: GlobalTranslationService) {}

  getCurrentLanguage(): string {
    return this.globalTranslationService.getCurrentLanguage();
  }

  getLanguageChange$() {
    return this.globalTranslationService.getLanguageChange$();
  }

  toggleLanguage(): void {
    this.globalTranslationService.toggleLanguage();
  }

  translate(key: string): string {
    return this.globalTranslationService.translate(key);
  }

  isRTL(): boolean {
    return this.globalTranslationService.isRTL();
  }

  isTranslationsLoaded(): boolean {
    return this.globalTranslationService.isTranslationsLoaded();
  }

  getTranslations(): any {
    return this.globalTranslationService.getTranslations();
  }
}