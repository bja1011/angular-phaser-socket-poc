import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrashGameService {
  constructor(
  ) {
  }

  getUnfinished() {
    return of();
    // return this.apiService.get('trash/unfinished');
  }

  postTypeStart(type: number) {
    return of();

    // return this.apiService.post(`trash/${type}/start`);
  }

  postFinish(trash_game_id: number, progress: string) {
    return of();

    // const options: ApiOptions = {
    //   body: {
    //     progress,
    //   },
    // };
    //
    // return this.apiService.post(`trash/${trash_game_id}/finish`, options);
  }

  postResult(trash_game_id: number, progress: string) {
    return of();

    // const options: ApiOptions = {
    //   body: {
    //     progress,
    //   },
    // };
    //
    // return this.apiService.post(`trash/${trash_game_id}/progress`, options);
  }
}
