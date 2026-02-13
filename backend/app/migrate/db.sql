create table public.profile (
  user_id uuid not null,
  email character varying null,
  account_status public.account_status_enum null default 'active'::account_status_enum,
  stripe_customer_id character varying null,
  billing_cycle_count numeric null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  role public.user_role_enum null default 'user'::user_role_enum,
  constraint profile_pkey primary key (user_id),
  constraint profile_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.transaction (
  transaction_id uuid not null default extensions.uuid_generate_v4 (),
  bot_id uuid null,
  version_id uuid null,
  tradetype public.trade_type_enum null,
  lotsize numeric(10, 2) null,
  profit_loss numeric(20, 2) null,
  open_at timestamp with time zone null,
  close_at timestamp with time zone null,
  constraint transaction_pkey primary key (transaction_id),
  constraint transaction_bot_id_fkey foreign KEY (bot_id) references bots (bot_id),
  constraint transaction_version_id_fkey foreign KEY (version_id) references bots_version (version_id)
) TABLESPACE pg_default;

create table public.ppo_model (
  ppo_model_id uuid not null default extensions.uuid_generate_v4 (),
  version character varying null,
  modelpath character varying null,
  created_at timestamp with time zone null default now(),
  constraint ppo_model_pkey primary key (ppo_model_id)
) TABLESPACE pg_default;

create table public.mts_accounts (
  mt5_id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  account_name character varying null,
  token character varying not null,
  balance numeric(20, 2) null default 0.00,
  created_at timestamp with time zone null default now(),
  constraint mts_accounts_pkey primary key (mt5_id),
  constraint mts_accounts_user_id_fkey foreign KEY (user_id) references profile (user_id) on delete CASCADE
) TABLESPACE pg_default;

create table public.llm_model (
  llm_model_id uuid not null default extensions.uuid_generate_v4 (),
  version character varying null,
  modelpath character varying null,
  created_at timestamp with time zone null default now(),
  constraint llm_model_pkey primary key (llm_model_id)
) TABLESPACE pg_default;

create table public.invoice (
  invoice_id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  start_period date null,
  end_period date null,
  total_profit numeric(20, 2) null,
  commission_rate numeric(5, 2) null default 0.1,
  commission_amount numeric(20, 2) null,
  status public.pay_status_enum null default 'unpaid'::pay_status_enum,
  payment_id character varying null,
  paid_at timestamp with time zone null,
  due_date timestamp with time zone null,
  constraint invoice_pkey primary key (invoice_id),
  constraint invoice_user_id_fkey foreign KEY (user_id) references profile (user_id) on delete CASCADE
) TABLESPACE pg_default;

create table public.bots_version (
  version_id uuid not null default extensions.uuid_generate_v4 (),
  ppo_model_id uuid null,
  llm_model_id uuid null,
  version_name text null,
  created_at timestamp with time zone null default now(),
  constraint bots_version_pkey primary key (version_id),
  constraint bots_version_llm_model_id_fkey foreign KEY (llm_model_id) references llm_model (llm_model_id),
  constraint bots_version_ppo_model_id_fkey foreign KEY (ppo_model_id) references ppo_model (ppo_model_id)
) TABLESPACE pg_default;

create table public.bots (
  bot_id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  mt5_id uuid null,
  version_id uuid null,
  currency character varying(10) null,
  status public.bot_status_enum null default 'STOPPED'::bot_status_enum,
  created_at timestamp with time zone null default now(),
  constraint bots_pkey primary key (bot_id),
  constraint bots_mt5_id_fkey foreign KEY (mt5_id) references mts_accounts (mt5_id),
  constraint bots_user_id_fkey foreign KEY (user_id) references profile (user_id) on delete CASCADE,
  constraint bots_version_id_fkey foreign KEY (version_id) references bots_version (version_id)
) TABLESPACE pg_default;