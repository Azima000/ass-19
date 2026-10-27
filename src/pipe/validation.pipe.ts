import { PipeTransform, Injectable, ArgumentMetadata, } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    constructor(private readonly Schema: ZodType) { }

    transform(value: any, metadata: ArgumentMetadata) {
        console.log({ value,metadata });
        return value;
    }
}