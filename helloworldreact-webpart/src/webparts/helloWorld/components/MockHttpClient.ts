import { IList } from './IList';

export default class MockHttpClient  {

   private static _items: IList[] = [{ Title: 'Mock List', Id: '1' },
                                       { Title: 'Mock List 2', Id: '2' },
                                       { Title: 'Mock List 3', Id: '3' }];

   public static get(): Promise<IList[]> {
   return new Promise<IList[]>((resolve) => {
           resolve(MockHttpClient._items);
       });
   }
}