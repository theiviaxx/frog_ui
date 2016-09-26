import { Pipe } from '@angular/core';

@Pipe({name: 'tagArtistFilter'})
export class TagArtistFilterPipe {
    transform(value) {
        return value.filter(x => !x.artist);
    }
}