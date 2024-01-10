export class ReservationsDataSource {
  private dbConnection: any;
  private token;
  private user: any;

  constructor(options: { token: string }) {
    this.dbConnection = this.initializeDBConnection();
    this.token = options.token;
  }

  async initializeDBConnection() {
    // set up our database details, instantiate our connection,
    // and return that database connection
    return this.dbConnection;
  }

  async getUser() {
    if (!this.user) {
      // store the user, lookup by token
      this.user = await this.dbConnection.User.findByToken(this.token);
    }
    return this.user;
  }

  async getReservation(reservationId: any) {
    const user = await this.getUser();
    if (user) {
      return await this.dbConnection.Reservation.findByPk(reservationId);
    } else {
      // handle invalid user
    }
  }

  //... more methods for finding and creating reservations
}