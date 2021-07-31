/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { Dispatch, bindActionCreators } from 'redux';
 import { connect } from 'react-redux';
 import { SectionList, SectionListData, StyleSheet, View } from 'react-native';
 import { Layout, Text, withStyles, ThemeType } from 'react-native-ui-kitten';
 import { bind as autobind, debounce } from 'lodash-decorators';


 import { NavigationBar } from '@components/navigation-bar/navigation-bar.component';
 import { TransactionCard } from '@components/amazon-transaction-card.component';

 import { ScreenRoute } from '@enums/routes.enum';

 import { IGlobalState } from '@models/app/global-state.model';
 import { IAmazonTransactionRequest } from '@models/http/transaction.model';
 import { ITransaction, ITransactionJSON } from '@models/app/transaction-json.model';
 import { ITransactionGroup } from '@models/actions-results.model';

 import { ITransactionDetailScreenProps } from '@screens/transaction-detail/transaction-detail.screen';

 import { IAppScreenProps } from '@interfaces/app-screen-props.interface';
 import { IAppScreen } from '@interfaces/app-screen.interface';

 import { Navigator } from '@navigation/navigator';

 import { setAmazonTransactionsFilter, loadAmazonTransactionItemsAsync } from '@actions/app.actions';

 // Debounce Decorator Function Options
 const debOptions: object = {leading: true, trailing: false};

 interface IMapStateToProps {
  transactionFilter: IAmazonTransactionRequest;
  transactionItems: ITransaction[];
  transactionGroups: ITransactionGroup[];
  totalCount: number;
  isLoadingTransactionItems: boolean;
  amazonTransactionLoadingError: string;
 }

 interface IMapDispatchToProps {
  loadAmazonTransactionItemsAsync: typeof loadAmazonTransactionItemsAsync;
  setAmazonTransactionsFilter: typeof setAmazonTransactionsFilter;
 }

 export interface IMainScreenProps extends IAppScreenProps, IMapStateToProps, IMapDispatchToProps {}

 export interface IMainScreenState {}

 class MainScreenComponent extends React.Component<IMainScreenProps, IMainScreenState> implements IAppScreen {

  private readonly testIdPrefix: string = 'main_screen';

   public state: IMainScreenState = {};
   // ---------------------

   componentDidMount(): void {
     if (this.props.loadAmazonTransactionItemsAsync) {
      this.props.loadAmazonTransactionItemsAsync();
     }
   }
   // ---------------------

   @autobind
   private refreshAmazonTransactionItems(): void {
     const newFilters: IAmazonTransactionRequest = this.props.transactionFilter || {} as IAmazonTransactionRequest;
     newFilters.offset = 0;
     this.props.setAmazonTransactionsFilter(newFilters);
     this.props.loadAmazonTransactionItemsAsync(false);
   }
   // ---------------------

   @autobind
   @debounce(500, debOptions)
   private fetchMoreAmazonTransactionItems(): void {
     if (!this.props.isLoadingTransactionItems && (this.props.transactionItems || []).length < this.props.totalCount) {
       const newFilters: IAmazonTransactionRequest = this.props.transactionFilter || {} as IAmazonTransactionRequest;

       if ( this.props.transactionItems.length <= this.props.totalCount ) {
        newFilters.offset = this.props.transactionItems.length;
       } else {
        newFilters.offset = 20;
       }
       this.props.setAmazonTransactionsFilter(newFilters);
       this.props.loadAmazonTransactionItemsAsync();
     }
   }
   // ---------------------

   @autobind
   @debounce(500, debOptions)
   private retryLoadAmazonTransactionAfterError(): void {
     this.props.loadAmazonTransactionItemsAsync();
   }
   // ---------------------

   @autobind
   private renderAmazonTransactionListFooterComponent(): React.ReactElement {
     return (
       <Text category="p2" appearance="hint" style={styles.mealsListFooter}>
         {'No more Results to show.'}
       </Text>
     );
   }
   // ---------------------

   @autobind
   private extractAmazonTransactionListItemKey(item: ITransaction): string {
     return `${item?.id || 'NA'}_${item?.reference || 'NA'}`;
   }
   // ---------------------

   @autobind
   private onTransactionCardPressed(transaction: ITransaction): () => void {
     return () => {
      if (transaction) {
        console.log(transaction.amount);
        Navigator.pushScreen(this.props.componentId, ScreenRoute.TRANSACTION_DETAIL_SCREEN, {
          transaction: transaction,
        } as ITransactionDetailScreenProps);
      }
     };
   }
  // ---------------------


   @autobind
   private renderAmazonTransactionListSectionHeader(info: { section: SectionListData<ITransaction> }): React.ReactElement {
       return (
         <Layout level="2" style={styles.mealsSectionListHeader}>
           <Text category="s1">
             {info.section.date}
           </Text>
         </Layout>
       );
   }
   // ---------------------

   @autobind
   private renderAmazonTransactionItem({ item, index }: {item: ITransaction | any, index: number}): React.ReactElement {
     return (
       <View style={styles.IssueItemContainer}>
         <TransactionCard
           transaction={item}
           onPress={this.onTransactionCardPressed(item)}/>
       </View>
     );
   }
   // ---------------------

   @autobind
   private renderAmazonTransactionList(): React.ReactElement {
    return (
      <View>
        <SectionList
          sections={this.props.transactionGroups as Array<SectionListData<ITransaction>>}
          renderItem={this.renderAmazonTransactionItem as any}
          renderSectionHeader={this.renderAmazonTransactionListSectionHeader}
          stickySectionHeadersEnabled={true}
          keyExtractor={this.extractAmazonTransactionListItemKey}
          onRefresh={this.refreshAmazonTransactionItems}
          refreshing={(this.props.isLoadingTransactionItems && this.props.transactionFilter.offset == 0) ? true : false}
          onEndReached={this.fetchMoreAmazonTransactionItems}
          contentContainerStyle={styles.amazonTransactionListInnerContainerStyle}
          ListFooterComponent={this.renderAmazonTransactionListFooterComponent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

   public render(): React.ReactElement {
     return (
       <Layout level="2" style={styles.container}>
         {/* Navigation Bar */}
        <NavigationBar
          title={'Transactions'}
          renderBackButton={false}/>
         {
          this.props.transactionGroups && this.props.transactionGroups.length > 0 ?
          (
            this.renderAmazonTransactionList()
          ) :
          <React.Fragment />
         }
        </Layout>
      );
   }
 }

 // Styles -----------------------------------------------------------------------------------
 const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
   container: {
     flex: 1
   },
   searchResultsListContainer: {
     flex: 1,
     paddingHorizontal: 16
   },
   mealsSectionListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  mealsListFooter: {
    margin: 16,
    textAlign: 'center'
  },
  IssueItemContainer: {
     marginBottom: 16
   },
   amazonTransactionListInnerContainerStyle: {
    paddingBottom: 100
   }
 });
 // ------------------------------------------------------------------------------------------


 // Connecting To Redux ----------------------------------------------------------------------
 function mapStateToProps(state: IGlobalState): any {
   return {
     transactionFilter: state.app.transactionFilter,
     transactionItems: state.app.transactionItems,
     transactionGroups: state.app.transactionGroups,
     totalCount: state.app.totalCount,
     isLoadingTransactionItems: state.app.isLoadingTransactionItems,
     amazonTransactionLoadingError: state.app.transactionLoadingError
   };
 }
 // -----------

 function mapDispatchToProps(dispatch: Dispatch<any>): any {
   return {
     ...bindActionCreators({
      loadAmazonTransactionItemsAsync,
      setAmazonTransactionsFilter
     }, dispatch),
   };
 }
 // ----------------------------------

 const MainScreenConnected = connect(mapStateToProps, mapDispatchToProps)(MainScreenComponent);

 export const MainScreen = withStyles(MainScreenConnected, (theme: ThemeType) => ({
   selectedTabHighlighter: {
     backgroundColor: theme['color-primary-500']
   },
   layoutLevel2: {
     backgroundColor: theme['background-basic-color-2'],
   },
   layoutLevel3: {
     backgroundColor: theme['background-basic-color-3'],
   }
 }));