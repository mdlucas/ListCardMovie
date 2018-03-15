/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Container, Header, Title, Label, Card, CardItem, Content, Button, List, ListItem, Thumbnail, Left, Right, Body, Icon, Text } from 'native-base';
import axios from 'axios';
import moment from 'moment'


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: false,
      error: false,
      modalDetails: false,
      movieSelect: [],
    };

  }
  componentDidMount() {
    this.getMovies();
  }
  getMovies() {
    this.setState({ loading: true });

    axios({
      method: 'get',
      url: 'https://api.themoviedb.org/3/movie/upcoming?api_key=d6310ab3a5631bacc49937865afba07a&language=en-US',
    }).then((response) => {

      if (response.status == 200) {
        this.setState({ loading: false, movies: response.data.results });
      } else {
        this.setState({ loading: false, error: true });
      }

    })
      .catch((error) => {
        this.setState({ loading: false, error: true });
        //
      });
  }
  getDetails(idMovie) {
    this.setState({ loading: true });

    axios({
      method: 'get',
      url: 'https://api.themoviedb.org/3/movie/' + idMovie + '?api_key=d6310ab3a5631bacc49937865afba07a&language=en-US',
    }).then((response) => {
      console.log(response.data)
      if (response.status == 200) {
        this.setState({ loading: false, movieSelect: response.data, modalDetails: true });
      } else {
        this.setState({ loading: false, error: true });
      }

    })
      .catch((error) => {
        this.setState({ loading: false, error: true });
        //
      });
  }
  _renderItem = ({ item }) => (
    <CardItem>

      <Image style={styles.thumbnail} source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }} />
      <Body style={styles.bodyCard}>
        <Text>{item.title}</Text>
        <View style={styles.backDate}>
          <Text style={styles.note}>{moment(item.release_date).format('DD/MM/YYYY')}</Text>
        </View>
        <Text note>{item.overview.length > 200 ? `${item.overview.substr(0, 200)}...` : item.overview}</Text>
        <Button small style={{ marginTop: 10 }} onPress={() => this.getDetails(item.id)}>
          <Text>Detalhes </Text>
        </Button>
        <Text note>{item.vote_count} Votos</Text>
      </Body>
      <View style={styles.backNote}>
        <Text style={styles.note}>{item.vote_average}</Text>
      </View>
    </CardItem>
  )
  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>The Movie DB</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Card>
            <FlatList
              data={this.state.movies}
              extraData={this.state.movies}
              keyExtractor={(i) => i.title}
              renderItem={this._renderItem}
            />

          </Card>
          <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.modalDetails}
            onRequestClose={() => {
              this.setState({ modalDetails: false });
            }}>
            <Container>
              <Header>
                <Left>
                  <Button transparent onPress={() => this.setState({ modalDetails: false })}>
                    <Icon name='arrow-back' />
                  </Button>
                </Left>
                <Body />
                <Right />
              </Header>
              <Content>
                <Image style={styles.imgDetails} source={{ uri: 'https://image.tmdb.org/t/p/w780' + this.state.movieSelect.backdrop_path }} />
                <View style={styles.backNoteDetails}>
                  <Text style={styles.noteDetails} >{this.state.movieSelect.vote_average}</Text>
                </View>
                <View style={styles.details}>
                  <Image style={styles.thumbnail} source={{ uri: 'https://image.tmdb.org/t/p/w500' + this.state.movieSelect.poster_path }} />
                  <View >
                    <Text style={styles.title} >{this.state.movieSelect.original_title} - {this.state.movieSelect.runtime} min</Text>
                    <View style={styles.tags}>
                      {this.state.movieSelect.genres && this.state.movieSelect.genres.map((item) => {
                        return <Text style={styles.tag}>{item.name}</Text>;
                      })}

                    </View>
                    <View style={styles.backDateDetails}>
                      <Text style={styles.note}>{moment(this.state.movieSelect.release_date).format('DD/MM/YYYY')}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ padding: 10 }}>
                  <Text>{this.state.movieSelect.overview}</Text>

                </View>

              </Content>


            </Container>

          </Modal>
        </Content>
        {this.state.loading &&
          <View style={{
            position: 'absolute',
            left: 0,
            backgroundColor: "white",
            opacity: 0.70,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ActivityIndicator size='large' />
            <Label style={{ color: "#673AB7" }}>Carregando...</Label>

          </View>
        }

      </Container>
    );
  }
}

const styles = StyleSheet.create({

  thumbnail: {
    height: 180,
    width: 120
  },
  note: {
    color: 'white',
    fontWeight: 'bold'
  },
  bodyCard: {
    paddingLeft: 20,
    justifyContent: 'center'
  },
  tags: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    width: '90%'
  },
  tag: {
    backgroundColor: '#2196F3',
    padding: 5,
    height: 35,
    marginTop: 5,
    width: 'auto',
    borderRadius: 12,
    color: 'white',
    marginLeft: 5
  },
  details: {
    padding: 10,
    flexDirection: 'row',
    marginTop: 10
  },
  imgDetails: { height: 240 },
  noteDetails: {
    fontSize: 24,
    color: 'white'
  },
  backNote: {
    position: 'absolute',
    bottom: 20,
    left: 105,
    backgroundColor: '#0288D1',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: 46,
    borderRadius: 23
  },
  backNoteDetails: {
    position: 'absolute',
    top: 180,
    right: 20,
    backgroundColor: '#0288D1',
    justifyContent: 'center',
    alignItems: 'center',
    height: 68,
    width: 68,
    borderRadius: 34
  },
  backDate: {
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    height: 20,
    borderRadius: 10
  },
  backDateDetails: {
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    padding: 10,
    marginTop: 5,
    alignItems: 'center',
    height: 20,
    width: 140,
    marginLeft: 10,
    borderRadius: 10
  },
  countVotes: {
    position: 'absolute',
    bottom: 10,
    right: 20
  },
  title: {
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold'
  }

});
