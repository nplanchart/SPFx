import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { IHelloworldReactState } from './IHelloworldReactState';  

import { IList } from './IList';
import { IListCollection } from './IListCollection';

import {
  Environment,
  EnvironmentType
 } from '@microsoft/sp-core-library';



import MockHttpClient from './MockHttpClient';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import { escape } from '@microsoft/sp-lodash-subset';



export default class HelloWorld extends React.Component<IHelloWorldProps,IHelloworldReactState> {
  
  
    constructor(props: IHelloWorldProps, state: IHelloworldReactState) {  
      super(props);  
    
      this.state = {  
        status: 'Ready',  
        items: []  
      };  
    }  

  public render(): React.ReactElement<IHelloWorldProps> {
  const items: JSX.Element[] = this.state.items.map((item: IList): JSX.Element => {  
      return ( 
        <div className={ styles.row }><ul><li><span>{item.Title}</span> </li></ul></div>
      );  
    });
   
   return (
    <div className={ styles.helloWorld }>
      <div className={ styles.container }>
        <div className={ styles.row }>
          <div className={ styles.column }>
            <span className={ styles.title }>Welcome to SharePoint!</span>
            <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
            <p className={ styles.description }>{escape(this.props.description)}</p>
            <a href="https://aka.ms/spfx" className={ styles.button }>
              <span className={ styles.label }>Learn more</span>
            </a>
            <a href="#" className={`${styles.button}`} onClick={() => this.readItem()}>  
                  <span className={styles.label}>Read item</span>  
            </a>
            <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>  
              <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>  
                {this.state.status}  
                <ul>  
                  {items}  
                </ul>  
              </div>  
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
  
  }
  private _getMockListData(): Promise<IListCollection> {
    return MockHttpClient.get()
      .then((data: IList[]) => {
        var listData: IListCollection = { value: data };
        return listData;
      }) as Promise<IListCollection>;
  }
  
  private _getListData(): Promise<IListCollection> {
    /*return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
    */
   return this.props.spHttpClient.get(this.props.siteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
      
   }


  private readItem(): void {
    this.setState({  
      status: 'Loading list...7',  
      items: []  
    });  

    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      
        this._getMockListData()
          .then((item: IListCollection): void => {  
        this.setState({  
          status: `Cargadas`,  
          items: item.value  
        });  
      }, (error: any): void => {  
        this.setState({  
          status: 'Loading latest list item failed with error: ' + error,  
          items: []  
        });  
      });
      }
    else if (Environment.type == EnvironmentType.SharePoint || 
              Environment.type == EnvironmentType.ClassicSharePoint) {
                this._getListData()
                .then((item: IListCollection): void => {  
              this.setState({  
                status: `Cargadas`,  
                items: item.value  
              });  
            }, (error: any): void => {  
              this.setState({  
                status: 'Loading latest item failed with error: ' + error,  
                items: []  
              });  
            }); 
    }
    
/*
    this._getMockListData()
          .then((item: IListCollection): void => {  
        this.setState({  
          status: `Cargadas`,  
          items: item.value  
        });  
      }, (error: any): void => {  
        this.setState({  
          status: 'Loading latest item failed with error: ' + error,  
          items: []  
        });  
      });

   
    this._getListData()
          .then((item: IListCollection): void => {  
        this.setState({  
          status: `Cargadas`,  
          items: item.value  
        });  
      }, (error: any): void => {  
        this.setState({  
          status: 'Loading latest item failed with error: ' + error,  
          items: []  
        });  
      }); 
   */
  }
}
