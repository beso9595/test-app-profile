import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../shared/components/card/card.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, CardComponent, MatButtonModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  width = '300px';
  height = '400px';
  pricingList = [
    {
      id: 'regular',
      title: 'Regular',
      price: 5,
      description: 'For people who just want something but don’t really know why.',
      advantages: [
        'You get… access. To stuff.',
        'Emails that may or may not matter.',
        'Slightly less disappointment than doing nothing.',
      ],
      btnColor: '',
    },
    {
      id: 'premium',
      title: 'Premium',
      price: 15,
      description: 'Because you’re better than Regular.',
      advantages: [
        'Twice the stuff. Maybe even thrice.',
        'Priority support (we’ll think about replying).',
        'Unlocks mysterious “premium” vibes.',
      ],
      btnColor: 'primary',
    },
    {
      id: 'pro',
      title: 'Pro',
      price: 45,
      description: 'You’re not just a user—you’re a legend.',
      advantages: [
        'All the buttons work.',
        'You can say “I’m Pro” at parties.',
        'Our devs will pretend to listen to your feedback.',
      ],
      btnColor: 'accent',
    }
  ];

  onChoose(id: string): void {
    const find = this.pricingList.find(i => i.id === id);
    if (find) {
      alert(`You chose ${find.title} pricing!`);
    }
  }
}
