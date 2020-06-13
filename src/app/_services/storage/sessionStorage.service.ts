import { Injectable, InjectionToken } from '@angular/core';
import { StorageService } from './storage.interface';

@Injectable({ providedIn: 'root' })
export class SessionStorageService implements StorageService {

    getItem(key: string): string {
        return sessionStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    clear(): void {
        sessionStorage.clear();
    }

}
