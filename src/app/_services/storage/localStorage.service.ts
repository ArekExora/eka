import { Injectable, InjectionToken } from '@angular/core';
import { StorageService } from './storage.interface';

@Injectable({ providedIn: 'root' })
export class LocalStorageService implements StorageService {

    getItem(key: string): string {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }

}
