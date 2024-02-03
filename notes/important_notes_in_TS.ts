//! REGULAR VARIABLE DECLARATION - NO TYPES
{
  const homeAddress = "123 Main St."; //! - String
  const houseNumber = 123; //! - Number
  const isHome = true; //! - Boolean
  console.log(homeAddress, houseNumber, isHome);
}

//! HOW TO EXPLICITLY DECLARE TYPES
{
  const homeAddress: string = "123 Main St.";
  const houseNumber: number = 123;
  const isHome: boolean = true;
  console.log(homeAddress, houseNumber, isHome);
}

//! ARRAYS / LISTS
//! DATA TYPE WILL BE INFERRED AS LIST OF STRING - IN TS - string[].
const names = ["Alice", "Bob", "Eve"];

//! DESTRUCTURING - REPRESENTING EACH ITEM IN THE LIST WITH A CUSTOM NAME, FOR EASY ACCESS I GUESS.
const [alice, bob, eve] = names;
console.log(alice, bob, eve);

//! SIMPLE FOR LOOP ON ALL ITEMS IN THE LIST
names.forEach((name) => {
  console.log(name.toUpperCase());
});

//! ADDING TO LIST
names.push("Mallory");

//! REMOVING LAST ITEM IN LIST
const last = names.pop();

//! USING MAP FUNCTION ON LIST
const lengths: number[] = names.map((name) => name.length);
console.log(lengths); //! [5, 3, 3]

//! UNIONS
//! a variable whose type is a union of string and number
//! meaning that this variable can be either a string or a number
let nameOrAge: string | number = "John";
console.log(nameOrAge);
nameOrAge = 25;
console.log(nameOrAge);

//! THE BELOW is invalid since the declared type is string | number
//! but the value we are assigning to this variable is an array
//! of type (string | number)[] (an array of strings and numbers)
//! nameOrAge = ['John', 25];

//! AN ARRAY OF UNION TYPES - SAY STRINGS AND NUMBERS
let namesAndAges: (string | number)[] = [
  "John",
  40,
  "Jane",
  50,
  60,
  "Adam",
  "Eve",
];
namesAndAges.push(30);

//! FUNCTIONS
function plus(a: number, b: number): number {
  return a + b;
}

function concat(a: string, b: string): string {
  return a + b;
}

//! FUNCTIONS CAN RETURN UNIONS TOO
function extractValue<Type>(atIndex: number, from: Type[]): Type | undefined {
  return from[atIndex];
}

const firstValue = extractValue(0, [1, 2, 3]);
const secondValue = extractValue(1, [1, 2, 3]);
const thirdValue = extractValue(2, [1, 2, 3]); //! ALL 3 ABOVE IS TYPE NUMBER
const fourthValue = extractValue(3, [1, 2, 3]); //! TYPE UNDEFINED

//!
//! BASIC DEFINITION OF CLASSES
class Circle {
  //! POSITIONAL PARAMS
  constructor(public x: number, public y: number, public radius: number) {}
  area() {
    return Math.PI * this.radius * this.radius;
  }
}

const circle = new Circle(10, 20, 30);
console.log(circle.area()); //! 2827.4333882308138

//!
//! ASSIGNING DEFAULT VALUES
class Circle1 {
  x = 0;
  y = 0;
  radius = 0;
  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

//! CLASSES CAN HAVE READ ONLY FIELDS
class Person {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const foo = new Person("foo");
//! foo.name = "bar"; // Error: Cannot assign to 'name' because it is a read-only property.

//!
//! ENUMS AND INHERITANCE
enum Color {
  Red = 1,
  Green = 2,
  Blue = 3,
}

class Vehicle {
  constructor(public color: Color) {}
}

//! INHERITANCE
class Car extends Vehicle {
  constructor(public wheels: number, color: Color) {
    super(color);
  }
}

class RedCar extends Car {
  constructor(public wheels: number) {
    super(wheels, Color.Red);
  }
}

//!
//! FAT ARROW
class Shape {
  constructor(public x: number, public y: number, public radius: number) {}
  area = () => Math.PI * this.radius * this.radius;
}

const shape = new Shape(10, 10, 10);

//!
//!
//! PUBLIC, PRIVATE, PROTECTED.
class Human {
  constructor(public name: string) {}
}

class Employee extends Human {
  constructor(name: string, protected department: string) {
    super(name);
  }
}

class Manager extends Employee {
  constructor(name: string, department: string, private reports: Employee[]) {
    super(name, department);
  }
  //! this exposes an aspect of an otherwise private field
  //! to the public interface of the class
  reportCount: number = this.reports.length;
  describe() {
    console.log(`Manager: ${this.name}`);
    console.log(`Department: ${this.department}`);
    console.log(`Reports: ${this.reportCount}`);
  }
}

const manager = new Manager("Alice", "Sales", [
  new Employee("Bob", "Sales"),
  new Employee("Eve", "Sales"),
]);

//! not accessible outside the class
//! console.log(manager.reports); // error: this wont' compile

manager.describe();
console.log(manager.reportCount);
