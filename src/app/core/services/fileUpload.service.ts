// import { Component, Injectable } from "@angular/core";
// import {
//     HttpInterceptor,
//     HttpRequest,
//     HttpHandler,
//     HttpEvent,
//     HttpProgressEvent,
//     HttpEventType,
//     HttpResponse,
// } from "@angular/common/http";
// import { Observable, of, concat } from "rxjs";
// import { delay } from "rxjs/operators";

// @Injectable()
// export class UploadInterceptor implements HttpInterceptor {
//     intercept(
//         req: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         if (req.url === "http://localhost:7000/api/upload") {
//             console.log('upload');

//             const events: Observable<HttpEvent<any>>[] = [0, 30, 60, 100].map((x) =>
//                 of(<HttpProgressEvent>{
//                     type: HttpEventType.UploadProgress,
//                     loaded: x,
//                     total: 100,
//                 }).pipe(delay(1000))
//             );

//             const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
//             events.push(success);

//             return concat(...events);
//         }

//         if (req.url === "removeUrl") {
//             return of(new HttpResponse({ status: 200 }));
//         }

//         return next.handle(req);
//     }
// }