import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Layout, Text, withStyles, ThemeType, StyleType } from 'react-native-ui-kitten';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { bind as autobind } from 'lodash-decorators';
import { ITransaction } from '@models/app/transaction-json.model';

import moment from 'moment';
import _ from 'lodash';


interface ITransactionCardProps {
  transaction: ITransaction;
  onPress?: () => void;
  themedStyle?: StyleType;
}

class AmazonTransactionCardComponent extends React.PureComponent<ITransactionCardProps> {

  constructor(props: ITransactionCardProps) {
    super(props);
  }

  componentDidMount(): void {}
  // ---------------------

  @autobind
  private onCardPressed(): void {
    if (this.props.onPress && typeof this.props.onPress == 'function') {
      this.props.onPress();
    }
  }
  // ---------------------

  render(): React.ReactElement {
    // if (this.props.wallet) {
      return (
        <TouchableOpacity
          activeOpacity={this.props.onPress ? 0.6 : 1}
          onPress={this.onCardPressed}
          disabled={this.props.onPress ? false : true}>
          <Layout level="1" style={[styles.container, {borderColor: this.props.themedStyle?.layout3Color?.color || 'none'}]}>

            {/* Bank Icon */}
            <View style={[styles.bankICon, {borderColor: this.props.themedStyle?.layout3Color?.color || 'none' }]}>
                <MaterialCommunityIcons
                  name={'bank-outline'}
                  size={25}
                  color={'white'} />
            </View>

            {/* Name, Date and Transaction Type */}
            <View style={styles.counterPartyDetail}>
              <Text category="s1" style={[{ fontSize: 14},
              {color: (this.props.transaction.type === 'DEBIT' ? this.props.themedStyle?.dangerColor?.color : this.props.themedStyle?.successColor?.color) || 'rgba(0, 0, 0, 0)'}
              ]}>
                {`${this.props.transaction.counterparty.firstName} ${this.props.transaction.counterparty.lastName}`}
              </Text>
              <Text category="p2" style={{ fontSize: 10, marginTop: 0}}>
                {`${moment.utc(this.props.transaction.date).local().format('YYYY-MM-DD')}`}
              </Text>
              <Text category="p2" style={{ fontSize: 10, marginTop: 5}}>
                {`${this.props.transaction.type}`}
              </Text>
            </View>

            {/* Amount */}
            <View style={styles.dateAndPaymentDetail}>
              <Text category="s1" style={[{color: '#FF9819', fontSize: 16},
                {color: (this.props.transaction.type === 'DEBIT' ? this.props.themedStyle?.dangerColor?.color : this.props.themedStyle?.successColor?.color) || 'rgba(0, 0, 0, 0)'}]}>
                {`${this.props.transaction.amount}`}
              </Text>
            </View>
          </Layout>
        </TouchableOpacity>
      );
  }

}

// Styles ------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingTop: 16,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  bankICon: {
    alignSelf: 'stretch',
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 25,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  counterPartyDetail: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginStart: 8
  },
  dateAndPaymentDetail: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  issueTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }

});

// Export Component With Style Props From Theme -----------------
export const TransactionCard = withStyles(AmazonTransactionCardComponent, (theme: ThemeType) => ({
  layout3Color: {
    color: theme['background-basic-color-3']
  },
  dangerColor: {
    color: theme['color-danger-500'],
  },
  successColor: {
    color: theme['color-success-500']
  }
}));
