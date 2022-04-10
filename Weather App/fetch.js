class Fetch {
  async getCurrent(input) {
    const myKey = "82ff730144d8b4580a81cbdee001b323";
    //make request to url
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid%=${myKey}`
    );
    var data = await response.json();
    console.log(data);
    return data;
  }
}
