import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { CommandType } from './Models/Command';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommandRequest } from './Models/CommandRequest';

@Injectable()
export class CommandCreateService extends WebService<CommandType | ICommandRequest> {
    URL = 'commands/command-types';

    getCommandsType(key: string): Observable<CommandType[]> {
        return super.get(`${key}`).pipe(
            map((d: CommandType[]) => {
                return d.map(ct => {
                    ct.Id = ct.Command.Id;
                    ct.Name = ct.Command.Name;
                    return ct;
                });
            })
        );
    }

    setCommandsType(command: ICommandRequest) {
        return super.post(command);
    }
}
