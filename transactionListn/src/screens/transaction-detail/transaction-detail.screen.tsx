import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Layout, Text, withStyles, ThemeType, StyleType } from 'react-native-ui-kitten';
import { bind as autobind, debounce } from 'lodash-decorators';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationBar } from '@components/navigation-bar/navigation-bar.component';


import { IGlobalState } from '@models/app/global-state.model';
import { ITransaction } from '@models/app/transaction-json.model';


import { IAppScreenProps } from '@interfaces/app-screen-props.interface';
import { IAppScreen } from '@interfaces/app-screen.interface';
import { Navigator } from '@navigation/navigator';

import moment from 'moment';

 // Debounce Decorator Function Options
const debOptions: object = {leading: true, trailing: false};

interface IMapStateToProps {
  isLoadingMealList: boolean;
}

interface IMapDispatchToProps {
}

export interface ITransactionDetailScreenProps extends IAppScreenProps, IMapStateToProps, IMapDispatchToProps {
  transaction: ITransaction;
  themedStyle?: StyleType;
}

export interface ITransactionDetailScreenState {
}

class AmazonTransactionDetailScreenComponent extends React.Component<ITransactionDetailScreenProps, ITransactionDetailScreenState> implements IAppScreen {

  public state: ITransactionDetailScreenState = {
  };

  @autobind
  private renderRow(): React.ReactElement {
    return (
        <Layout level="2" style={[styles.transactionItemsContainer, {borderColor: this.props.themedStyle?.layoutLevel3?.backgroundColor || 'none'}]}>
          <View style={{paddingVertical: 10}}>
            <View style={styles.item}>
              <Text style={{fontSize: 11, fontWeight: '300'}}>Transaction ID</Text>
              <Text style={{fontSize: 11}}>{this.props.transaction.id}</Text>
            </View>
            <View style={styles.separator}/>

            <View style={styles.item}>
                <Text style={{fontSize: 11, fontWeight: '300'}}>Transaction Type</Text>
                <Text style={[{fontSize: 11}, {color: (this.props.transaction.type === 'DEBIT' ? this.props.themedStyle?.dangerColor?.color : this.props.themedStyle?.successColor?.color) || 'rgba(0, 0, 0, 0)'}]}>{this.props.transaction.type}</Text>
            </View>
            <View style={styles.separator}/>

            <View style={styles.item}>
              <Text style={{fontSize: 11, fontWeight: '300'}}>Date</Text>
              <Text style={{fontSize: 11}}>{`${moment.utc(this.props.transaction.amount).local().format('YYYY-MM-DD')}`}</Text>
            </View>
            <View style={[styles.separator, {borderBottomWidth: 1}]}/>

            <View style={{paddingTop: 30, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{ fontSize: 10, fontWeight: '300'}}>Sort Code: {this.props.transaction.counterparty.sortCode}</Text>
              <Text style={{fontSize: 10, fontWeight: '300'}}>Transaction made at {moment.utc(this.props.transaction.date).local().format('YYYY-MM-DD hh:mm A Z')}</Text>
            </View>

         </View>

        </Layout>
    );
}

  componentDidMount(): void {
  }
  // ---------------------

  @autobind
  @debounce(500, debOptions)
  private goBack(): void {
    Navigator.popScreen(this.props.componentId);
  }
  // ---------------------

  public render(): React.ReactElement {
    return (
      <Layout level="1" style={styles.container}>
        {/* Navigation Bar */}
        <NavigationBar
         title={`${moment.utc(this.props.transaction.date).local().format('YYYY-MM-DD HH:MM A')}`}
         renderBackButton={true}
         onBackButtonPress={this.goBack}/>


        <View style={{ marginHorizontal: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.themedStyle?.bankIconContainer.backgroundColor, height: 200, width: Dimensions.get('window').width - 8}}>
          {/* Bank Icon */}
          <View style={[styles.bankICon]}>
            <MaterialCommunityIcons
              name={'bank-outline'}
              size={25}
              color={'white'} />
          </View>
          {
            this.props.transaction.type === 'DEBIT' ?
            (<Text category="p2" style={styles.paymentType}>
                {`${this.props.transaction.counterparty.firstName} has received ${this.props.transaction.amount > 0 ? this.props.transaction.amount : -1 * this.props.transaction.amount} ${this.props.transaction.currency} \nfrom you`}
            </Text>)
            :
          (
            <Text category="p2" style={styles.paymentType}>
                {`You received  ${this.props.transaction.amount} ${this.props.transaction.currency} \nfrom ${this.props.transaction.counterparty.firstName}`}
            </Text>
          )
          }
          </View>

        {/* Transaction Data */}
        {
          this.renderRow()
        }
       </Layout>
     );
  }
}

 // Styles -----------------------------------------------------------------------------------
const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
  bankICon: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentType: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5
  },
  searchResultsListContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  transactionItemsContainer: {
    flex: 1,
    paddingRight: 4,
    paddingLeft: 4,
    marginHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10
  },

  separator: {
    marginVertical: 5,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  orderButton: {
    marginTop: 50,
    alignSelf: 'center'
  }
});

 // Connecting To Redux ----------------------------------------------------------------------
function mapStateToProps(state: IGlobalState): any {
  return {
  };
}
// -----------

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return {
    ...bindActionCreators({
    }, dispatch),
  };
}
// ----------------------------------

const TransactionDetailScreenConnected = connect(mapStateToProps, mapDispatchToProps)(AmazonTransactionDetailScreenComponent);

export const TransactionDetailScreen = withStyles(TransactionDetailScreenConnected, (theme: ThemeType) => ({
  layoutLevel3: {
    backgroundColor: theme['background-basic-color-3'],
  },
  bankIconContainer: {
    backgroundColor: theme['background-basic-color-4']
  },
  dangerColor: {
    color: theme['color-danger-500'],
  },
  successColor: {
    color: theme['color-success-500']
  }
}));